import {Component, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import {TextDecoder} from "text-encoding";
import {ApiService, SensorEntryPPB} from "../app.service";
import * as fileSystem from "file-system";
import * as dialogs from "ui/dialogs";

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
export class ConnectComponent implements OnInit {

    private _scanDurationSeconds = 4;
    private _discoveredPeripherals = new Set();
    private _knownPeripherals = new Set();
    private _knownPeripheralsFile;

    constructor(private api: ApiService) {
        for (var i = 0; i < 7; i++) {
            if (Math.random() < .5) {
                this._knownPeripherals.add({
                    UUID: '65445',
                    name: 'Device #' + i,
                    RSSI: 1,
                    services: [],
                    battery: Math.round(Math.random() * 100)
                });
            } else {
                this._discoveredPeripherals.add({
                    UUID: '65445',
                    name: 'Device #' + i,
                    RSSI: 1,
                    services: [],
                    battery: Math.round(Math.random() * 100)
                });
            }
        }
    }

    popup() {
        dialogs.action({
            message: "How often do you want to receive data?",
            cancelButtonText: "Cancel text",
            actions: ["1 Minute", "3 Minutes", "5 Minutes", "10 Minutes", "30 Minutes"]
        }).then(result => {
            console.log("Dialog result: " + result);
            if (result == "1 Minute") {
                const intval = 1;
                alert('Oiseh n?  ' + intval);
            } else if (result == "3 Minutes") {
                //Do action2
            } else if (result == "5 Minutes") {
                //Do action2
            } else if (result == "10 Minutes") {
                //Do action2
            } else if (result == "30 Minutes") {
                //Do action2
            }
        });
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
                if (this._knownPeripherals.has(peripheral)) {
                    return;
                }

                this._discoveredPeripherals.add(peripheral);
            }
        });
    }

    connect(peripheral: bluetooth.Peripheral): void {
        console.log("PERIPHERAL DISCOVERED, CONNECTING: " + peripheral.UUID);
        this._discoveredPeripherals.delete(peripheral);
        this._knownPeripherals.add(peripheral);

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
        const service = ConnectComponent.getAirMonitorService(peripheral);

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
