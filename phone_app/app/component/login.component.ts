import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService} from "../app.service";
const googleSignIn = require("nativescript-google-signin");

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

    constructor(private api: ApiService) {
    }

    ngOnInit(): void {
    }

    submit(): void {

    }
}
