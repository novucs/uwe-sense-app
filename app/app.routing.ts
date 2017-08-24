import {NgModule} from "@angular/core";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {Routes} from "@angular/router";

import {ConnectComponent} from "./component/connect.component";
import {PeripheralComponent} from "./component/peripheral.component";
import {LoginComponent} from "./component/login.component";
import {AboutComponent} from "./component/about.component";

export const routes: Routes = [
    {path: "", redirectTo: "/login", pathMatch: "full"},
    {path: "login", component: LoginComponent},
    {path: "peripheral", component: PeripheralComponent},
    {path: "connect", component: ConnectComponent},
    {path: "about", component: AboutComponent},
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
}