import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService} from "../app.service";
import {ActivatedRoute} from "@angular/router";
import * as bluetooth from "nativescript-bluetooth";
import * as dialogs from "ui/dialogs";
import * as fileSystem from "file-system";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./peripheral.component.html",
    // template: '<numberpicker:NumberPicker value="3" minValue="2" maxValue="6" id="np"></numberpicker:NumberPicker>'
})
export class PeripheralComponent implements OnInit {

    // private _accountId;
    // private _token;
    private _updating: boolean = false;
    private _zeroToSixty = Array(60).fill(1, 61).map((x, i) => i);
    private _zeroToTwentyFour = Array(24).fill(1, 25).map((x, i) => i);
    private _peripheral;
    private _knownPeripherals = [];
    private _knownPeripheralsFile;

    constructor(private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private api: ApiService) {
        // this._accountId = route.snapshot.params["accountId"];
        // this._token = route.snapshot.params["token"];
        this._peripheral = {
            UUID: route.snapshot.params["peripheralId"],
            name: route.snapshot.params["peripheralName"]
        };
    }

    ngOnInit(): void {
        this._knownPeripheralsFile = fileSystem.knownFolders.currentApp().getFile("known-peripherals.json");
        this._knownPeripheralsFile.readText().then(content => {
            if (!content) {
                return;
            }

            console.log("Connecting to previously discovered peripherals: " + content);
            this._knownPeripherals = JSON.parse(content);
        });
    }

    update(): void {
        this._updating = true;

        dialogs.alert("Device successfully updated").then(() => {
            this.routerExtensions.navigate(['/connect'], {clearHistory: false});
        });

        this._updating = false;
    }

    unregister(): void {
        dialogs.confirm({
            title: "Unregister " + this._peripheral.name,
            message: "Are you sure you wish to unregister this device?",
            okButtonText: "Yes",
            cancelButtonText: "No",
            neutralButtonText: "Cancel"
        }).then(response => {
            if (!response) {
                return;
            }

            // TODO: Unregister the device.
            for (let i = 0; i < this._knownPeripherals.length; i++) {
                if (this._knownPeripherals[i].UUID == this._peripheral.UUID) {
                    this._knownPeripherals.splice(i, 1);
                }
            }
            const serializedPeripherals = JSON.stringify(Array.from(this._knownPeripherals));
            console.log("WRITING: " + serializedPeripherals);
            this._knownPeripheralsFile.writeText(serializedPeripherals).then(value => {
                console.log("WRITE SUCCESS: " + value);
            });

            bluetooth.disconnect({UUID: this._peripheral.UUID});

            dialogs.alert("Device successfully unregistered").then(() => {
                this.routerExtensions.navigate(['/connect'], {clearHistory: true});
            });
        });
    }
}
