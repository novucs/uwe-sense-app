import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {AppRoutingModule} from "./app.routing";
import {AppComponent} from "./app.component";

import {ConnectComponent} from "./component/connect.component";
import {ApiService} from "./app.service";
import {PeripheralComponent} from "./component/peripheral.component";
import {LoginComponent} from "./component/login.component";
import {NativeScriptRouterModule} from "nativescript-angular";
import {routes} from "./app.routing";
import {Http} from "@angular/http";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        Http,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        ConnectComponent,
        PeripheralComponent,
        LoginComponent
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
