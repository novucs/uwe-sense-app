import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {AppRoutingModule} from "./app.routing";
import {AppComponent} from "./app.component";

import {MainComponent} from "./connect/connect.component";
import {ApiService} from "./app.service";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        MainComponent
    ],
    providers: [
        ApiService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule {
}
