import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ServicePipeModule } from '../../services/pipe';
import 'froala-editor/js/plugins.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PagebuilderModule } from '../modules/pagebuilder';
import { SanitizeHtmlModule } from '../../frontend/sanitizehtmlpipe';

import { GetlistComponent } from './get-list/get-list.component';
import { ProcessContentComponent } from './process/process.component';

const routes: Routes = [
	{ path: '', redirectTo: 'get-list' },
	{ path: 'get-list', component: GetlistComponent },
	{ path: 'insert', component: ProcessContentComponent },
	{ path: 'update/:id', component: ProcessContentComponent },
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		ModalModule.forRoot(),
		TranslateModule,
		TooltipModule.forRoot(),
		BsDatepickerModule.forRoot(),

		FroalaEditorModule.forRoot(),
		FroalaViewModule.forRoot(),
		ServicePipeModule,
		SanitizeHtmlModule,
		PagebuilderModule
	],
	declarations: [
		GetlistComponent,
		ProcessContentComponent
	],
})
export class FaqModule { }
