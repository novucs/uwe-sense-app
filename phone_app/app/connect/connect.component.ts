import {Component, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import {TextDecoder} from "text-encoding";

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

        setInterval(() => {
            console.log("STARTING SCANNING");
            bluetooth.startScanning({
                serviceUUIDs: [],
                seconds: this._scanDurationSeconds,
                onDiscovered: peripheral => {
                    this.peripheralFound(peripheral);
                }
            });
        }, 10000);
    }

    peripheralFound(peripheral: bluetooth.Peripheral): void {
        // D5:39:11:E2:E3:12 - Probably the RedBear

        if (peripheral.UUID == "7C:75:C0:45:EA:05" || // Apple watch
            peripheral.UUID == "6E:A0:0F:56:73:BF" || // Poppy’s MacBook Pro
            peripheral.UUID == "AC:BC:32:90:E2:40" || // Poppy’s MacBook Pro
            peripheral.UUID == "B8:E8:56:40:E4:AF" || // STAFF-JIM-SMITH
            peripheral.UUID == "47:12:A5:03:50:16" || // null
            peripheral.UUID == "59:06:53:59:E3:72") { // iPhone
            console.log("IGNORING " + peripheral.UUID);
            return;
        }

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
                    console.log("Value: " + JSON.stringify(result.value));
                    console.log("Value raw: " + result.valueRaw);

                    // result.value is an ArrayBuffer. Every service has a different encoding.
                    // fi. a heartrate monitor value can be retrieved by:
                    // var data = new Uint8Array(result.value);
                    // var heartRate = data[1];
                    // console.log(heartRate);

                    var string = new TextDecoder("UTF-8").decode(result.value);
                    console.log("String: " + string);

                    // function buf2hex(buffer) {
                    //     return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
                    // }
                    //
                    // console.log(buf2hex(result.value)); // = 04080c10
                }, err => {
                    console.log("read error: " + err);
                });
            }, this._scanDurationSeconds * 1000);
        });
    }
}
