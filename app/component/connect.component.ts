import {Component, NgZone, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import {TextDecoder} from "text-encoding";
import {ApiService, SensorReading, Authenticate} from "../app.service";
import * as fileSystem from "file-system";
import {ActivatedRoute} from "@angular/router";
import {RouterExtensions} from "nativescript-angular";
import firebase = require("nativescript-plugin-firebase");

const SENSOR_SERVICE_ID: string = "a80b";
const SCAN_DURATION_SECONDS: number = 4;

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./connect.component.html",
})
export class ConnectComponent implements OnInit {

    // private _accountId;
    // private _token;
    private _loggingOut: boolean = false;
    private _scanning: boolean = false;
    private _discoveredPeripherals = [];
    private _knownPeripherals = [];
    private _knownPeripheralsFile;

    constructor(private zone: NgZone,
                private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private api: ApiService) {
        console.log(JSON.stringify(route.snapshot.params));
        // this._accountId = route.snapshot.params["accountId"];
        // this._token = route.snapshot.params["token"];
        // for (let i = 0; i < 7; i++) {
        //     let peripheral = {
        //         UUID: '6544' + i,
        //         name: 'Device #' + i,
        //         RSSI: 1,
        //         services: [],
        //         battery: Math.round(Math.random() * 100)
        //     };
        //
        //     if (Math.random() < .5) {
        //         this._knownPeripherals.push(peripheral);
        //     } else {
        //         this._discoveredPeripherals.push(peripheral);
        //     }
        // }
    }

    ngOnInit(): void {
        this._knownPeripheralsFile = fileSystem.knownFolders.currentApp().getFile("known-peripherals.json");
        this._knownPeripheralsFile.readText().then(content => {
            if (!content) {
                return;
            }

            console.log("Known peripherals: " + content);
            this._knownPeripherals = JSON.parse(content);
        });
    }

    logout(): void {
        this._loggingOut = true;
        firebase.logout().then(() => {
            this.routerExtensions.navigate(['/login'], {clearHistory: false}).then(() => {
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
                    if (this.findPeripheral(this._knownPeripherals, peripheral.UUID)) {
                        this.connect(peripheral);
                        devicesFound++;
                        return;
                    }

                    if (!this.findPeripheral(this._discoveredPeripherals, peripheral.UUID)) {
                        this._discoveredPeripherals.push(peripheral);
                        devicesFound++;
                        return;
                    }
                }
            }).then(a => {
                this._scanning = false;
                alert("Scan complete, " + devicesFound + " devices found.");
            }).catch(error => {
                alert("Scanning error: " + error);
            });
        });
    }

    configure(peripheral: bluetooth.Peripheral): void {
        const params = {
            // accountId: this._accountId,
            // token: this._token,
            peripheralId: peripheral.UUID,
            peripheralName: peripheral.name
        };

        this.routerExtensions.navigate(['/peripheral', params], {clearHistory: false});
    }

    connect(peripheral: bluetooth.Peripheral): void {
        console.log("Connecting to peripheral with ID: " + peripheral.UUID);

        bluetooth.connect({
            UUID: peripheral.UUID,
            onConnected: peripheral => {
                this.connectCallback(peripheral);
            },
            onDisconnected: data => {
                alert("Disconnected from " + peripheral.name);
            }
        }).then(success => {
        }, error => {
            alert("Failed to connect to " + peripheral.name);
        });
    }

    connectCallback(peripheral: bluetooth.Peripheral): void {
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
        this.deletePeripheral(this._discoveredPeripherals, peripheral.UUID);
        this.addPeripheral(this._knownPeripherals, peripheral);
        this.zone.run(() => {
        }); // Force page refresh, for some reason it doesn't naturally update here.
        alert("Connected to " + peripheral.name);

        this.api.createDevice({
            deviceId: peripheral.UUID,
            typeIds: service.characteristics
        });

        bluetooth.startNotifying({
            peripheralUUID: peripheral.UUID,
            serviceUUID: service.UUID,
            characteristicUUID: characteristic.UUID,
            onNotify: result => {
                const data = new Uint8Array(result.value);
                const particlesPerBillion = data[1];
                console.log(particlesPerBillion);

                const reading: SensorReading = {
                    deviceId: peripheral.UUID,
                    typeId: "Carbon Emissions",
                    timestamp: new Date(),
                    data: particlesPerBillion
                };

                this.api.submitReading(reading);
            }
        }).then(() => {
            console.log("Notifications subscribed");
        });
    }

    addPeripheral(peripherals: any[], peripheral: any): void {
        this.deletePeripheral(peripherals, peripheral.UUID);
        peripherals.push(peripheral);
    }

    deletePeripheral(peripherals: any[], peripheralId: string): void {
        for (let i = 0; i < peripherals.length; i++) {
            if (peripherals[i].UUID == peripheralId) {
                peripherals.splice(i, 1);
            }
        }
    }

    findPeripheral(peripherals: any[], uuid: string) {
        for (let peripheral of peripherals) {
            if (peripheral.UUID == uuid) {
                return peripheral;
            }
        }
        return null;
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
