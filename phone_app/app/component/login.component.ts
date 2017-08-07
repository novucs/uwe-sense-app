import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService} from "../app.service";
import firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

    constructor(private api: ApiService) {
    }

    ngOnInit(): void {
        firebase.init({
        }).then(instance => {
            console.log("Firebase init done!");
                firebase.login({
                    type: firebase.LoginType.GOOGLE
                }).then(
                    function (result) {
                        console.log(JSON.stringify(result));
                    },
                    function (errorMessage) {
                        console.log(errorMessage);
                    }
                );
        },
        error => {
            console.log("Firebase init error: " + error);
        });
    }

    submit(): void {
    }
}
