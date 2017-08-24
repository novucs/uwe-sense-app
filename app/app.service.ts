import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
// import {Headers, Http, RequestOptions} from "@angular/http";
const CryptoJS = require("crypto-js");
const http = require("http");

@Injectable()
export class ApiService {

    private baseUrl = "http://ec2-35-166-177-195.us-west-2.compute.amazonaws.com:8080";
    private authenticateUrl = this.baseUrl + "/citizen-sensing/authenticate-user-jwt?provider=firebase";
    private dataPublishingUrl = this.baseUrl + "/citizen-sensing/device-data-publishing";
    private createDeviceUrl = this.baseUrl + "/citizen-sensing/register-device-with-hardware-id";
    private authorisationJwt = "";
    private idToken = "";

    constructor() {
    }

    public setIdToken(token: string) {
        this.idToken = token;
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

    // submitSensorEntryPPB(entry: SensorEntryPPB) {
    //     console.log(JSON.stringify(entry));
    //     http.request({
    //         url: "http://ec2-35-166-177-195.us-west-2.compute.amazonaws.com:8080/rt/http-data-publishing?apikey=b941bee8-afcf-479d-8f99-8862c4661b65",
    //         // url: "https://httpbin.org/post",
    //         method: "POST",
    //         headers: {"Content-Type": "application/json"},
    //         // content: JSON.stringify({uuid: "F0:26:AD:98:23:84", data: 7})
    //         content: JSON.stringify(entry)
    //     }).then(response => {
    //         // const result = response.content.toJSON();
    //         console.log("POSTED SENSOR PPB DATA");
    //         console.log(response ? JSON.stringify(response.headers) : {});
    //     }, error => {
    //         console.log("Error occurred " + error);
    //     });
    // }
}

// Particles per billion read from an air monitor sensor at a particular time.
// export interface SensorEntryPPB {
//     uuid: string;    // The sensor unique identifier
//     data: number;    // The particles per billion value
//     timestamp: Date; // The time and date this data was read
// }

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

export interface RequestDevices {
}
