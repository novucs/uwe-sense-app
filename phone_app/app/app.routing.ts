import {NgModule} from "@angular/core";
import {NativeScriptRouterModule} from "nativescript-angular/router";
import {Routes} from "@angular/router";

import {ConnectComponent} from "./component/connect.component";

const routes: Routes = [
    {path: "", redirectTo: "/connect", pathMatch: "full"},
    {path: "connect", component: ConnectComponent},
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule {
}
