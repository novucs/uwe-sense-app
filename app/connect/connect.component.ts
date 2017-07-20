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
            if (!granted) {
                bluetooth.requestCoarseLocationPermission();
                return;
            }

            bluetooth.startScanning({
                serviceUUIDs: [],
                seconds: 4,
                onDiscovered: peripheral => {
                    // Empty method, peripheral information gets logged as is.

                    bluetooth.connect({
                        UUID: peripheral.UUID,
                        onConnected: data => {
                            console.log("Connected to " + peripheral.UUID + " services " + peripheral.services);

                            peripheral.services.forEach(service => {
                                service.characteristics.forEach(characteristic => {
                                    bluetooth.read({
                                        peripheralUUID: peripheral.UUID,
                                        serviceUUID: service.UUID,
                                        characteristicUUID: characteristic.UUID
                                    }).then(result =>{
                                        // fi. a heartrate monitor value (Uint8) can be retrieved like this:
                                        var data = new Uint8Array(result.value);
                                        console.log("Your heartrate is: " + data[1] + " bpm");
                                    }).then(function(err) {
                                        console.log("read error: " + err);
                                    });
                                });
                            });
                        },
                        onDisconnected: data => {
                            console.log("Disconnected from " + peripheral.UUID + ", data: " + JSON.stringify(data));
                        }
                    }).then(data =>
                        console.log("Connection success: " + JSON.stringify(data))
                    ).catch(error =>
                        console.log("Connection failed: " + JSON.stringify(error)));
                }
            }).then(() => console.log("complete")).catch(error => {
                console.log("error" + error);
            });

            // bluetooth.connect({
            //     UUID: "18:5E:0F:E9:E6:29",
            //     onConnected: data => {
            //         console.log("Connected to 18:5E:0F:E9:E6:29");
            //     },
            //     onDisconnected: data => {
            //         console.log("Disconnected from 18:5E:0F:E9:E6:29, data: " + JSON.stringify(data));
            //     }
            // }).then(data =>
            //     console.log("Connection success: " + JSON.stringify(data))
            // ).catch(error =>
            //     console.log("Connection failed: " + JSON.stringify(error)));



            // bluetooth.write({
            //     peripheralUUID: '4C:BB:58:0A:9F:BB',
            //     serviceUUID: '1801',
            //     characteristicUUID: 'optimus',
            //     value: '0x01' // a hex 1
            // }).then(result => {
            //     console.log("value written: " + JSON.stringify(result));
            // }).then(error => {
            //     console.log("write error: " + JSON.stringify(error));
            // });

        });
    }
}
