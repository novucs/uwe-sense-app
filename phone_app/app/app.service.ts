import {Injectable} from "@angular/core";
import "rxjs/add/operator/map";
const http = require("http");

@Injectable()
export class ApiService {

    constructor() {
    }

    submitSensorEntryPPB(entry: SensorEntryPPB) {
        http.request({
            url: "http://localhost/api/sensor",
            method: "POST",
            headers: {"Content-Type": "application/json"},
            content: entry
        }).then(response => {
            const result = response.content.toJSON();
            console.log("POSTED SENSOR PPB DATA");
        }, error => {
            console.log("Error occurred " + error);
        });
    }
}

// Particles per billion read from an air monitor sensor at a particular time.
export interface SensorEntryPPB {
    uuid: string;    // The sensor unique identifier
    timestamp: Date; // The time and date this data was read
    data: number;    // The particles per billion value
}
