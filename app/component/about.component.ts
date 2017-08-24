import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {RouterExtensions} from "nativescript-angular";
import {ActivatedRoute} from "@angular/router";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./about.component.html",
})
export class AboutComponent implements OnInit {

    private _previousPage: string;

    constructor(private routerExtensions: RouterExtensions,
                private route: ActivatedRoute) {
        this._previousPage = route.snapshot.params["page"];
    }

    ngOnInit(): void {
    }

    back() {
        this.routerExtensions.navigate([this._previousPage], {clearHistory: true});
    }
}
