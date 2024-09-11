import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { GetListComponent } from './get-list/get-list.component';


const routes: Routes = [
    { path: '', redirectTo: 'get-list' },
    { path: 'get-list', component: GetListComponent },
]
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
    ],
    declarations: [
        GetListComponent,
    ]
})
export class SettingsLanguageModule { }
