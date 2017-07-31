import {Component, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import {TextDecoder} from "text-encoding";
import {ApiService, SensorEntryPPB} from "../app.service";
import * as fileSystem from "file-system";

const AIR_MONITOR_SERVICE_ID = "a80b";

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
    private _discoveredPeripherals = [];
    private _knownPeripherals = [];
    private _knownPeripheralsFile;

    constructor(private api: ApiService) {
    }

    ngOnInit(): void {
        this._knownPeripheralsFile = fileSystem.knownFolders.currentApp().getFile("known-peripherals.json");
        this._knownPeripheralsFile.readText().then(content => {
            if (!content) {
                return;
            }

            this._knownPeripherals = JSON.parse(content);
            this._discoveredPeripherals = this._knownPeripherals;
        });

        this._discoveredPeripherals.push({
          UUID: '65445',
          name: 'Hello',
          RSSI: 1,
          services: []
        });

        this._discoveredPeripherals.push({
          UUID: '65445',
          name: 'loskoa',
          RSSI: 1,
          services: []
        });

        bluetooth.hasCoarseLocationPermission().then(granted => {
            if (!granted) {
                bluetooth.requestCoarseLocationPermission();
            }

            this.scan();
        });
    }

    scan(): void {
        console.log("STARTING SCANNING");

        bluetooth.startScanning({
            serviceUUIDs: [AIR_MONITOR_SERVICE_ID],
            seconds: this._scanDurationSeconds,
            onDiscovered: peripheral => {
                this._discoveredPeripherals.push(peripheral);
                this.connect(peripheral);
            }
        });
    }

    connect(peripheral: bluetooth.Peripheral): void {
        console.log("PERIPHERAL DISCOVERED, CONNECTING: " + peripheral.UUID);
        this._knownPeripherals.push(peripheral);

        bluetooth.connect({
            UUID: peripheral.UUID,
            onConnected: peripheral => {
                this.connectCallback(peripheral);
            },
            onDisconnected: data => {
                console.log("Disconnected from " + peripheral.UUID + ", data: " + JSON.stringify(data));
            }
        });
    }

    connectCallback(peripheral: bluetooth.Peripheral): void {
        console.log("CONNECTED TO " + JSON.stringify(peripheral));
        const service = MainComponent.getAirMonitorService(peripheral);

        if (service == null) {
            bluetooth.disconnect({UUID: peripheral.UUID});
            return;
        }

        const characteristic = service.characteristics[0];

        console.log("READING FROM PERIPHERAL " + peripheral.UUID + " AT SERVICE " + service.UUID + " USING CHARACTERISTIC " + characteristic.UUID);

        bluetooth.startNotifying({
            peripheralUUID: peripheral.UUID,
            serviceUUID: service.UUID,
            characteristicUUID: characteristic.UUID,
            onNotify: result => {
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
                    uuid: peripheral.UUID,
                    timestamp: new Date(),
                    data: data.particlesPerBillion
                };

                this.api.submitSensorEntryPPB(entry);
            }
        }).then(() => {
            console.log("Notifications subscribed");
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
