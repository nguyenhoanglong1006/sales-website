import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ServicePipeModule } from '../../../services/pipe';

import { MenuGetListComponent } from './get-list/get-list.component'
import { MenuProcessComponent } from './process/process.component';

export const routes: Routes = [
    { path: '', redirectTo: 'get-list' },
    { path: 'get-list', component: MenuGetListComponent },
    { path: 'insert', component: MenuProcessComponent },
    { path: 'update/:id', component: MenuProcessComponent },
];

@NgModule({

    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        ServicePipeModule
    ],
    
    declarations: [
        MenuGetListComponent,
        MenuProcessComponent,
    ],
})
export class CategoryMenuModule { }