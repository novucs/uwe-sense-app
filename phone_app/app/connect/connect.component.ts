import {Component, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";

declare const android: any;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./connect.component.html",
})
export class MainComponent implements OnInit {

    private _scanDurationSeconds = 4;

    constructor() {
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

        console.log("STARTING SCANNING");

        bluetooth.startScanning({
            serviceUUIDs: [],
            seconds: this._scanDurationSeconds,
            onDiscovered: peripheral => {
                this.peripheralFound(peripheral);
            }
        });
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
            var service = peripheral.services[0];
            var characteristic = service.characteristics[0];

            console.log("READING FROM PERIPHERAL " + peripheral.UUID + " AT SERVICE " + service.UUID + " USING CHARACTERISTIC " + characteristic.UUID);

            setTimeout(() => {
                bluetooth.read({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: service.UUID,
                    characteristicUUID: characteristic.UUID
                }).then(result => {
                    console.log("Value: " + result.value);
                    console.log("Value raw: " + result.valueRaw);
                }, err => {
                    console.log("read error: " + err);
                });
            }, this._scanDurationSeconds * 1000);
        });
    }
}
