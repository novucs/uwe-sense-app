import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService} from "../app.service";
import {ActivatedRoute} from "@angular/router";
import * as dialogs from "ui/dialogs";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./peripheral.component.html",
    // template: '<numberpicker:NumberPicker value="3" minValue="2" maxValue="6" id="np"></numberpicker:NumberPicker>'
})
export class PeripheralComponent implements OnInit {

    private _updating: boolean = false;
    private _zeroToSixty = Array(60).fill(1, 61).map((x, i) => i);
    private _zeroToTwentyFour = Array(24).fill(1, 25).map((x, i) => i);
    private _peripheral = {name: ""};

    constructor(private routerExtensions: RouterExtensions,
                private route: ActivatedRoute,
                private api: ApiService) {
        this._peripheral = {name: route.snapshot.params["name"]};
    }

    ngOnInit(): void {
    }

    update(): void {
        this._updating = true;
        alert("Device settings updated");
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

            dialogs.alert("Device successfully unregistered").then(() => {
                this.routerExtensions.backToPreviousPage();
            });
        });
    }
}
