import {Component, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import {TextDecoder} from "text-encoding";
import {ApiService, SensorEntryPPB} from "../app.service";

declare const android: any;

const AIR_MONITOR_SERVICE_ID = "1337";

export interface SensorData {
    serialId: string,
    particlesPerBillion: number,
    temperature: number,
    relativeHumidity: number,
    rawSensor: number,
    digitalTemperature: number,
    digitalRelativeHumidity: number,
    day: number,
    hour: number,
    minute: number,
    second: number
}

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./connect.component.html",
})
export class MainComponent implements OnInit {

    private _scanDurationSeconds = 4;

    constructor(private api: ApiService) {
    }

    ngOnInit(): void {
        bluetooth.hasCoarseLocationPermission().then(granted => {
            this.beginScanning(granted);
        });
    }

    beginScanning(grantedPermission): void {
        if (!grantedPermission) {
            bluetooth.requestCoarseLocationPermission();
        }

        setInterval(() => {
            console.log("STARTING SCANNING");
            bluetooth.startScanning({
                serviceUUIDs: [AIR_MONITOR_SERVICE_ID],
                seconds: this._scanDurationSeconds,
                onDiscovered: peripheral => {
                    this.peripheralFound(peripheral);
                }
            });
        }, 10000);
    }

    peripheralFound(peripheral: bluetooth.Peripheral): void {
        console.log("PERIPHERAL DISCOVERED, CONNECTING: " + peripheral.UUID);

        bluetooth.connect({
            UUID: peripheral.UUID,
            onConnected: peripheral => {
                this.peripheralConnected(peripheral);
            },
            onDisconnected: data => {
                console.log("Disconnected from " + peripheral.UUID + ", data: " + JSON.stringify(data));
            }
        });
    }

    peripheralConnected(peripheral): void {
        bluetooth.stopScanning().then(() => {
            console.log("CONNECTED TO " + JSON.stringify(peripheral));
            const service = MainComponent.getAirMonitorService(peripheral);

            if (service == null) {
                bluetooth.disconnect({UUID: peripheral.UUID});
                return;
            }

            const characteristic = service.characteristics[0];

            console.log("READING FROM PERIPHERAL " + peripheral.UUID + " AT SERVICE " + service.UUID + " USING CHARACTERISTIC " + characteristic.UUID);

            setTimeout(() => {
                bluetooth.read({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: service.UUID,
                    characteristicUUID: characteristic.UUID
                }).then(result => {
                    const output = new TextDecoder("UTF-8").decode(result.value).split(", ");

                    const data: SensorData = {
                        serialId: output[0],
                        particlesPerBillion: +output[1],
                        temperature: +output[2],
                        relativeHumidity: +output[3],
                        rawSensor: +output[4],
                        digitalTemperature: +output[5],
                        digitalRelativeHumidity: +output[6],
                        day: +output[7],
                        hour: +output[8],
                        minute: +output[9],
                        second: +output[10]
                    };

                    console.log(JSON.stringify(data));

                    const entry: SensorEntryPPB = {
                        uuid: peripheral.uuid,
                        timestamp: new Date(),
                        data: data.particlesPerBillion
                    };

                    this.api.submitSensorEntryPPB(entry);
                    bluetooth.disconnect({UUID: peripheral.UUID});
                }, err => {
                    console.log("read error: " + err);
                    bluetooth.disconnect({UUID: peripheral.UUID});
                });
            }, this._scanDurationSeconds * 1000);
        });
    }

    static getAirMonitorService(peripheral) {
        for (let i = 0; i < peripheral.services.length; i++) {
            const service = peripheral.services[i];

            if (service.UUID == AIR_MONITOR_SERVICE_ID) {
                return service;
            }
        }
        return null;
    }
}
