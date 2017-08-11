import {Component, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import {TextDecoder} from "text-encoding";
import {ApiService, SensorEntryPPB} from "../app.service";
import * as fileSystem from "file-system";
import firebase = require("nativescript-plugin-firebase");
import {ActivatedRoute} from "@angular/router";
import {RouterExtensions} from "nativescript-angular";

const SENSOR_SERVICE_ID: string = "a80b";
const SCAN_DURATION_SECONDS: number = 4;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./connect.component.html",
})
export class ConnectComponent implements OnInit {

    private _loggingOut: boolean = false;
    private _scanning: boolean = false;
    private _discoveredPeripherals = new Set();
    private _knownPeripherals = new Set();
    private _knownPeripheralsFile;

    constructor(private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private api: ApiService) {
        console.log(JSON.stringify(route.snapshot.params));
        for (let i = 0; i < 7; i++) {
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

    ngOnInit(): void {
        this._knownPeripheralsFile = fileSystem.knownFolders.currentApp().getFile("known-peripherals.json");
        this._knownPeripheralsFile.readText().then(content => {
            if (!content) {
                return;
            }

            console.log("Connecting to previously discovered peripherals: " + content);
            this._knownPeripherals = new Set(JSON.parse(content));
            this._knownPeripherals.forEach(peripheral => this.connect(peripheral));
        });
    }

    logout(): void {
        this._loggingOut = true;
        firebase.logout().then(() => {
            this.routerExtensions.navigate(['/login'], {clearHistory: true}).then(() => {
                alert("Successfully logged out!")
            });
        });
    }

    scan(): void {
        let devicesFound = 0;

        bluetooth.hasCoarseLocationPermission().then(granted => {
            if (!granted) {
                bluetooth.requestCoarseLocationPermission();
            }

            console.log("STARTING SCANNING");

            this._scanning = true;
            bluetooth.startScanning({
                serviceUUIDs: [SENSOR_SERVICE_ID],
                seconds: SCAN_DURATION_SECONDS,
                onDiscovered: peripheral => {
                    devicesFound++;

                    if (this._knownPeripherals.has(peripheral)) {
                        return;
                    }

                    this._discoveredPeripherals.add(peripheral);
                }
            }).then(a => {
                this._scanning = false;
                alert("Scan complete, " + devicesFound + " devices found.");
            }).catch(error => {
                alert("Scanning error: " + error);
            });
        });
    }

    connect(peripheral: bluetooth.Peripheral): void {
        console.log("Connecting to peripheral with ID: " + peripheral.UUID);
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
        }).then(a => console.log("a: " + a), b => console.log("b: " + b)).catch(c => console.log("c: " + c));
    }

    connectCallback(peripheral: bluetooth.Peripheral): void {
        console.log("CONNECTED TO " + JSON.stringify(peripheral));

        // Save peripherals.

        const serializedPeripherals = JSON.stringify(Array.from(this._knownPeripherals));
        console.log("WRITING: " + serializedPeripherals);
        this._knownPeripheralsFile.writeText(serializedPeripherals).then(value => {
            console.log("WRITE SUCCESS: " + value);
        });


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
                const data = new Uint8Array(result.value);
                const particlesPerBillion = data[1];
                console.log(particlesPerBillion);

                const entry: SensorEntryPPB = {
                    uuid: peripheral.UUID,
                    timestamp: new Date(),
                    data: particlesPerBillion
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

            if (service.UUID == SENSOR_SERVICE_ID) {
                return service;
            }
        }
        return null;
    }
}
