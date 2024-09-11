import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ContactSalelistComponent } from './get-list/get-list.component';
import { ContactSaleProcessComponent } from './process/process.component';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { BsModalService } from 'ngx-bootstrap/modal';



export const routes: Routes = [

    { path: '', redirectTo: 'get-list' },
    { path: 'get-list', component: ContactSalelistComponent },
    { path: 'insert', component: ContactSaleProcessComponent },
    { path: 'update/:id', component: ContactSaleProcessComponent },
];

@NgModule({
    declarations: [ContactSalelistComponent, ContactSaleProcessComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        AlertModule.forRoot(),
        ModalModule.forRoot(),
    ],
	providers: [
		BsModalRef,
        BsModalService
	],
})
export class ContactSaleModule { }
