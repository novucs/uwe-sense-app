import {Component, NgZone, OnInit} from "@angular/core";
import * as bluetooth from "nativescript-bluetooth";
import {TextDecoder} from "text-encoding";
import {ApiService, SensorReading} from "../app.service";
import * as fileSystem from "file-system";
import {RouterExtensions} from "nativescript-angular";

const SENSOR_SERVICE_ID: string = "a80b";
const SCAN_DURATION_SECONDS: number = 4;
const NOTIFY_CHARACTERISTICS = {
    "b4fbc6ce-380f-4ec1-be0a-d163efcf02c4": "Button Press"
};

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./connect.component.html",
})
export class ConnectComponent implements OnInit {

    private scanning: boolean = false;
    private scanningText: string = "Scanning";
    private disconnectedKnownPeripherals = [];
    private disconnectedPeripherals = [];
    private connectedPeripherals = [];
    private connectingIds = new Set();
    private knownPeripheralsFile;

    constructor(private zone: NgZone,
                private routerExtensions: RouterExtensions,
                private api: ApiService) {
    }

    ngOnInit(): void {
        this.knownPeripheralsFile = fileSystem.knownFolders.currentApp().getFile("known-peripherals.json");
        this.knownPeripheralsFile.readText().then(content => {
            if (!content) {
                return;
            }

            this.disconnectedKnownPeripherals = JSON.parse(content);

            for (let i = 0; i < this.disconnectedKnownPeripherals.length; i++) {
                this.connect(this.disconnectedKnownPeripherals[i], false);
            }
        });
    }

    quitSession(): void {
        this.routerExtensions.navigate(['/session'], {clearHistory: true});
    }

    addNote(): void {
        this.routerExtensions.navigate(['/note'], {clearHistory: false});
    }

    scan(): void {
        let devicesFound = 0;

        bluetooth.hasCoarseLocationPermission().then(granted => {
            if (!granted) {
                bluetooth.requestCoarseLocationPermission();
            }

            this.scanning = true;
            this.scanningText = "Scanning (" + SCAN_DURATION_SECONDS + " seconds remain)";

            for (let i = 1; i < SCAN_DURATION_SECONDS; i++) {
                setTimeout(() => {
                    this.scanningText = "Scanning (" + i + " seconds remain)";
                }, (SCAN_DURATION_SECONDS - i) * 1000);
            }

            bluetooth.startScanning({
                serviceUUIDs: [SENSOR_SERVICE_ID],
                seconds: SCAN_DURATION_SECONDS,
                onDiscovered: peripheral => {
                    if (ConnectComponent.findPeripheral(this.disconnectedKnownPeripherals, peripheral.UUID)) {
                        this.connect(peripheral, true);
                        devicesFound++;
                        return;
                    }

                    if (!ConnectComponent.findPeripheral(this.disconnectedPeripherals, peripheral.UUID)) {
                        this.disconnectedPeripherals.push(peripheral);
                        devicesFound++;
                        return;
                    }
                }
            }).then(() => {
                this.scanning = false;
                alert("Scan complete, " + devicesFound + " devices found.");
            }).catch(error => {
                alert("Scanning error: " + error);
            });
        });
    }

    configure(peripheral: bluetooth.Peripheral): void {
        const params = {
            peripheralId: peripheral.UUID,
            peripheralName: peripheral.name
        };

        this.routerExtensions.navigate(['/peripheral', params], {clearHistory: false});
    }

    connect(peripheral: any, msg: boolean): void {
        if (this.connectingIds.has(peripheral.UUID)) {
            alert("Already connecting to " + peripheral.name);
            return;
        }

        this.connectingIds.add(peripheral.UUID);
        peripheral.connecting = true;
        bluetooth.connect({
            UUID: peripheral.UUID,
            onConnected: peripheral => {
                this.connectCallback(peripheral);
                if (msg) {
                    alert("Connected to " + peripheral.name);
                }
            },
            onDisconnected: () => {
                this.connectingIds.delete(peripheral.UUID);
                ConnectComponent.deletePeripheral(this.connectedPeripherals, peripheral.UUID);
                peripheral.connecting = false;
                this.zone.run(() => {
                }); // Force page refresh, for some reason it doesn't naturally update here.
                alert("Disconnected from " + peripheral.name);
            }
        });
    }

    connectCallback(peripheral: bluetooth.Peripheral): void {
        // Save peripherals.
        this.connectedPeripherals.push(peripheral);
        const serializedPeripherals = JSON.stringify(Array.from(this.connectedPeripherals));

        this.knownPeripheralsFile.writeText(serializedPeripherals).then(() => {
            console.log("Successfully saved known devices to file");
        });

        const service = ConnectComponent.getAirMonitorService(peripheral);

        if (service == null) {
            bluetooth.disconnect({UUID: peripheral.UUID});
            return;
        }

        ConnectComponent.deletePeripheral(this.disconnectedKnownPeripherals, peripheral.UUID);
        ConnectComponent.deletePeripheral(this.disconnectedPeripherals, peripheral.UUID);
        ConnectComponent.addPeripheral(this.connectedPeripherals, peripheral);
        this.zone.run(() => {
        }); // Force page refresh, for some reason it doesn't naturally update here.

        let typeIds = [];

        for (let key in NOTIFY_CHARACTERISTICS) {
            typeIds.push(NOTIFY_CHARACTERISTICS[key]);
        }

        this.api.createDevice({
            deviceId: peripheral.UUID,
            typeIds: typeIds
        });

        for (let i = 0; i < service.characteristics.length; i++) {
            const characteristicId: string = service.characteristics[i].UUID;
            const typeId = NOTIFY_CHARACTERISTICS[characteristicId];

            if (!typeId) {
                continue;
            }

            bluetooth.startNotifying({
                peripheralUUID: peripheral.UUID,
                serviceUUID: service.UUID,
                characteristicUUID: characteristicId,
                onNotify: result => {
                    const data = new Uint8Array(result.value);
                    const value = data[1];
                    console.log("Received data for " + typeId + ": " + value);

                    const reading: SensorReading = {
                        session: this.api.getCurrentSession(),
                        deviceId: peripheral.UUID,
                        typeId: typeId,
                        timestamp: new Date(),
                        data: value
                    };

                    this.api.submitReading(reading);
                }
            }).then(() => {
                console.log("Notifications subscribed");
            });
        }
    }

    static addPeripheral(peripherals: any[], peripheral: any): void {
        ConnectComponent.deletePeripheral(peripherals, peripheral.UUID);
        peripherals.push(peripheral);
    }

    static deletePeripheral(peripherals: any[], peripheralId: string): void {
        for (let i = 0; i < peripherals.length; i++) {
            if (peripherals[i].UUID == peripheralId) {
                peripherals.splice(i, 1);
            }
        }
    }

    static findPeripheral(peripherals: any[], uuid: string) {
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
