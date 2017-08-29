import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";

const http = require("http");

@Injectable()
export class ApiService {

    private baseUrl: string = "http://ec2-35-166-177-195.us-west-2.compute.amazonaws.com:8080";
    private authenticateUrl: string = this.baseUrl + "/citizen-sensing/authenticate-user-jwt?provider=firebase";
    private dataPublishingUrl: string = this.baseUrl + "/citizen-sensing/device-data-publishing";
    private createDeviceUrl: string = this.baseUrl + "/citizen-sensing/register-device-with-hardware-id";
    private authorisationJwt: string = "";
    private session: Date;

    constructor() {
    }

    public startNewSession(): void {
        this.session = new Date();
    }

    public getCurrentSession(): Date {
        return this.session;
    }

    authenticate(token: string, successCallback: (success: string) => any, errorCallback: (error: string) => any): void {
        const headers = {};

        http.request({
            method: "POST",
            url: this.authenticateUrl,
            headers: headers,
            content: token
        }).then(response => {
            console.log("Token: " + response.content.toString());
            this.authorisationJwt = response.content.toString();
            successCallback(response);
        }, error => {
            console.log("Error occurred: " + error);
            errorCallback(error);
        });
    }

    createDevice(data: CreateDevice): void {
        console.log("Authorization token: " + this.authorisationJwt);
        const headers = {
            "Authorization": "Bearer " + this.authorisationJwt,
            "Content-Type": "application/json"
        };

        http.request({
            method: "POST",
            url: this.createDeviceUrl,
            headers: headers,
            content: JSON.stringify(data)
        }).then(response => {
            console.log("Posted data: " + response);
            console.log("Stringified data: " + response.content.toString());
        }, error => {
            console.log("Error occurred: " + error);
        });
    }

    submitReading(data: SensorReading): void {
        const headers = {
            "Authorization": "Bearer " + this.authorisationJwt,
            "Content-Type": "application/json"
        };

        http.request({
            method: "POST",
            url: this.dataPublishingUrl,
            headers: headers,
            content: JSON.stringify(data)
        }).then(response => {
            console.log("Posted data: " + response);
        }, error => {
            console.log("Error occurred: " + error);
        });
    }
}

export interface CreateDevice {
    deviceId: string;
    typeIds: string[];
}

export interface SensorReading {
    session: Date;
    deviceId: string;
    typeId: string;
    timestamp: Date;
    data: number;
}

export interface Info {
    session: Date;
    text: string;
    timestamp: Date;
}
