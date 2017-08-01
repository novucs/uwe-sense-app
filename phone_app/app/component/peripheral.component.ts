import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService} from "../app.service";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./peripheral.component.html",
})
export class PeripheralComponent implements OnInit {

    private _peripheral = {name: ""};

    constructor(private route: ActivatedRoute,
                private api: ApiService) {
        this._peripheral = {name: route.snapshot.params["name"]};
    }

    ngOnInit(): void {
    }
}
