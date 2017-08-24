import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService, Authenticate} from "../app.service";
import {RouterExtensions} from "nativescript-angular";
import firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

    private _signingIn: boolean = false;
    private _firebaseInitialized: boolean = false;

    constructor(private routerExtensions: RouterExtensions,
                private api: ApiService) {
    }

    goAbout(): void {
        const params = {page: "/login"};
        this.routerExtensions.navigate(['/about', params], {clearHistory: true});
    }

    ngOnInit(): void {
        if (this._firebaseInitialized) {
            return;
        }

        firebase.init({}).then(
            value => {
                this._firebaseInitialized = true;
                firebase.getCurrentUser().then(value => JSON.stringify("Current user: " + value));
            }
        );
    }

    login(): void {
        if (this._signingIn) {
            return;
        }

        this._signingIn = true;

        firebase.login({
            type: firebase.LoginType.GOOGLE
        }).then(account => {
                firebase.getAuthToken({forceRefresh: false}).then(token => {
                    const session: Authenticate = {
                        email: account.email,
                        secret: token
                    };

                    this.api.authenticate(session);
                    this.routerExtensions.navigate(['/connect'], {clearHistory: false}).then(() => {
                        alert("Successfully logged in as " + account.name);
                    });
                });
            }, error => {
                alert("An error occurred during login: " + error);
            }
        );
    }
}
