import {Component, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";

declare const android: any;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./connect.component.html",
})
export class MainComponent implements OnInit {

    constructor() {
    }

    ngOnInit(): void {
        bluetooth.hasCoarseLocationPermission().then(granted => {
            this.beginScanning(granted);
        });
    }

    beginScanning(grantedPermission) {
        if (!grantedPermission) {
            bluetooth.requestCoarseLocationPermission();
        }

        console.log(this);

        bluetooth.startScanning({
            serviceUUIDs: [],
            seconds: 4,
            onDiscovered: peripheral => {
                this.peripheralFound(peripheral);
            }
        }).then(() => console.log("complete")).catch(error => {
            console.log("error" + error);
        });
    }

    peripheralFound(peripheral: bluetooth.Peripheral) {
        console.log("PERIPHERAL DISCOVERED, CONNECTING: " + peripheral.UUID);

        bluetooth.connect({
            UUID: peripheral.UUID,
            onConnected: peripheral => {
                this.peripheralConnected(peripheral);
            },
            onDisconnected: data => {
                console.log("Disconnected from " + peripheral.UUID + ", data: " + JSON.stringify(data));
            }
        }).then(data =>
            console.log("Connection success: " + JSON.stringify(data))
        ).catch(error =>
            console.log("Connection failed: " + JSON.stringify(error)));
    }

    peripheralConnected(peripheral: bluetooth.Peripheral) {
        console.log("CONNECTED TO " + JSON.stringify(peripheral));

        peripheral.services.forEach(service => {
            service.characteristics.forEach(characteristic => {
                console.log("READING FROM SERVICE " + service + " USING CHARACTERISTIC " + characteristic);

                bluetooth.read({
                    peripheralUUID: peripheral.UUID,
                    serviceUUID: service.UUID,
                    characteristicUUID: characteristic.UUID
                }).then(result => {
                    // fi. a heartrate monitor value (Uint8) can be retrieved like this:
                    var data = new Uint8Array(result.value);
                    console.log("Your heartrate is: " + data[1] + " bpm");
                }).then(function (err) {
                    console.log("read error: " + err);
                });

            });
        });
    }
}
