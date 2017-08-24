import {NgModule, NO_ERRORS_SCHEMA} from "@angular/core";
import {NativeScriptModule} from "nativescript-angular/nativescript.module";
import {AppRoutingModule} from "./app.routing";
import {AppComponent} from "./app.component";

import {ConnectComponent} from "./component/connect.component";
import {ApiService} from "./app.service";
import {PeripheralComponent} from "./component/peripheral.component";
import {LoginComponent} from "./component/login.component";
import {NativeScriptRouterModule} from "nativescript-angular";
import {AboutComponent} from "./component/about.component";


import {routes} from "./app.routing";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        NativeScriptModule,
        NativeScriptRouterModule,
        NativeScriptRouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        ConnectComponent,
        PeripheralComponent,
        LoginComponent,
        AboutComponent
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
