import { uploadFileService } from './../../services/integrated/upload.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { GetlistComponent } from './get-list/get-list.component';
import { ProcessComponent } from './process/process.component';
import { AlertSendMailComponent } from './alert-send-mail/alert-send-mail.component';

const routes: Routes = [
	{ path: '', redirectTo: 'get-list' },
	{ path: 'get-list', component: GetlistComponent },
	{ path: 'insert', component: ProcessComponent },
	{ path: 'update/:id', component: ProcessComponent },
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		ModalModule.forRoot(),
		TooltipModule.forRoot(),
		TranslateModule,
		BsDatepickerModule.forRoot(),
	],
	providers: [uploadFileService],
	declarations: [
		GetlistComponent,
		ProcessComponent,
		AlertSendMailComponent
	]
})
export class OrdersModule { }
