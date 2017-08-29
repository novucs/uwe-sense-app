import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService} from "../app.service";
import {RouterExtensions} from "nativescript-angular";
import firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./session.component.html",
})
export class SessionComponent implements OnInit {

    private loggingOut: boolean = false;

    constructor(private routerExtensions: RouterExtensions,
                private api: ApiService) {
    }

    ngOnInit(): void {
    }

    startSession(): void {
        this.api.startNewSession();
        this.routerExtensions.navigate(['/connect'], {clearHistory: true});
    }

    goAbout(): void {
        const params = {page: "/session"};
        this.routerExtensions.navigate(['/about', params], {clearHistory: true});
    }

    logout(): void {
        this.loggingOut = true;
        firebase.logout().then(() => {
            this.routerExtensions.navigate(['/login'], {clearHistory: true}).then(() => {
                alert("Successfully logged out!")
            });
        });
    }
}
