import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
// import {Headers, Http, RequestOptions} from "@angular/http";
const http = require("http");

@Injectable()
export class ApiService {

    private server = {
        post: "https://httpbin.org/post",
        get: "https://httpbin.org/get"
    };

    constructor() {
    }

    private post(session: SessionInfo, entry: any) {
        http.request({
            url: this.server.post,
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: JSON.stringify(entry)
        }).then(response => {
            console.log("Post response: " + response ? JSON.stringify(response.headers) : {});
        }, error => {
            console.log("Error occurred " + error);
        });
    }

    postSensorReading(session: SessionInfo, reading: SensorReading) {
        this.post(session, reading);
    }

    postRegisterDevice(session: SessionInfo, registration: RegisterDevice) {
        this.post(session, registration);
    }

    getDevices(session: SessionInfo, request: RequestDevices) {
        http.request({url: this.server.get, method: "GET"}).then(response => {
            var str = response.content.toString();
            var obj = response.content.toJSON();
            var img = response.content.toImage();
        }, e => {
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

export interface SessionInfo {
    id: string;
    token: string;
}

export interface SensorReading {
    deviceId: string;
    typeId: string;
    timestamp: Date;
    data: number;
}

export interface RegisterDevice {
    deviceId: string;
    typeIds: string[];
}

export interface RequestDevices {
}
