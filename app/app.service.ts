import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
const CryptoJS = require("crypto-js");
const http = require("http");

@Injectable()
export class ApiService {

    private baseUrl: string = "http://ec2-35-166-177-195.us-west-2.compute.amazonaws.com:8080";
    private authenticateUrl: string = this.baseUrl + "/citizen-sensing/authenticate-user-jwt?provider=firebase";
    private dataPublishingUrl: string = this.baseUrl + "/citizen-sensing/device-data-publishing";
    private createDeviceUrl: string = this.baseUrl + "/citizen-sensing/register-device-with-hardware-id";
    private authorisationJwt: string = "";
    private idToken: string = "";
    private session: Date;

    constructor() {
    }

    public setIdToken(token: string) {
        this.idToken = token;
    }

    public startNewSession() {
        this.session = new Date();
    }

    private base64url(source) {
        // Encode in classical base64
        let encodedSource = CryptoJS.enc.Base64.stringify(source);

        // Remove padding equal characters
        encodedSource = encodedSource.replace(/=+$/, '');

        // Replace characters according to base64url specifications
        encodedSource = encodedSource.replace(/\+/g, '-');
        encodedSource = encodedSource.replace(/\//g, '_');

        return encodedSource;
    }

    private createJWT(headers, payload, secret) {
        let stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(headers));
        let encodedHeader = this.base64url(stringifiedHeader);

        let stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(payload));
        let encodedData = this.base64url(stringifiedData);

        let signature = encodedHeader + "." + encodedData;
        signature = CryptoJS.HmacSHA256(signature, secret);
        signature = this.base64url(signature);
        return encodedHeader + "." + encodedData + "." + signature;
    }

    authenticate(token: string, successCallback: any, errorCallback: any) {
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

    createDevice(data: CreateDevice) {
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

    submitReading(data: SensorReading) {
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

export interface Authenticate {
    email: string;
    secret: string;
}

export interface SensorReading {
    deviceId: string;
    typeId: string;
    timestamp: Date;
    data: number;
}

export interface CreateDevice {
    deviceId: string;
    typeIds: string[];
}

export interface Info {
    session: Date;
    text: string;
    timestamp: Date;
}
