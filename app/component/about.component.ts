import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService, Authenticate} from "../app.service";
import {RouterExtensions} from "nativescript-angular";
import firebase = require("nativescript-plugin-firebase");
import {Location} from '@angular/common';
@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./about.component.html",
})
export class AboutComponent implements OnInit {


    constructor(private routerExtensions: RouterExtensions,
                private api: ApiService, private _location: Location) {
    }




    ngOnInit(): void {

    }

  back(){

      this.routerExtensions.navigate(['/login'], {clearHistory: true});

  }
}
