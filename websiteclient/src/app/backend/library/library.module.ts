import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Routes, RouterModule } from "@angular/router";
import { TranslateModule } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { ModalModule } from "ngx-bootstrap/modal";
import { AlertModule } from "ngx-bootstrap/alert";
import { SanitizeUrlModule } from "../sanitizeurlpipe";

import { GetlistComponent } from "./getlist/getlist.component";
import { ProcessComponent } from "./process/process.component";
import { MainComponent } from "./main/main.component";
import { GroupComponent } from "./group/group.component";


const appRoutes: Routes = [
    { path: "", redirectTo: "get-list" },
    { path: "get-list", component: MainComponent },
    { path: "insert", component: ProcessComponent },
    { path: "update/:id", component: ProcessComponent },
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(appRoutes),
        TranslateModule,

        ModalModule.forRoot(),
        AlertModule.forRoot(),
        SanitizeUrlModule
    ],
    declarations: [
        GetlistComponent,
        ProcessComponent,
        MainComponent,
        GroupComponent
    ],
})
export class LibraryModule { }