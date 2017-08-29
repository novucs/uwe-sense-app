import {Component, OnInit} from "@angular/core";
import {TextDecoder} from "text-encoding";
import {ApiService, Info} from "../app.service";
import {RouterExtensions} from "nativescript-angular";

@Component({
    selector: "ns-items",
    moduleId: module.id,
    templateUrl: "./note.component.html",
})
export class NoteComponent implements OnInit {

    private note: string = "";

    constructor(private routerExtensions: RouterExtensions,
                private api: ApiService) {
    }

    ngOnInit(): void {
    }

    public submit(): void {
        const info: Info = {
            session: this.api.getCurrentSession(),
            text: this.note,
            timestamp: new Date()
        };

        this.api.submitInfo(info);
        this.routerExtensions.back();
        alert("Note successfully created!");
    }

    public updateNote(event) {
        this.note = event.value;
    }
}
