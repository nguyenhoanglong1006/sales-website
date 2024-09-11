import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { SanitizeHtmlModule } from '../../frontend/sanitizehtmlpipe';
import { ServicePipeModule } from '../../services/pipe';
import 'froala-editor/js/plugins.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PagebuilderModule } from '../modules/pagebuilder';

import { GetlistComponent } from './get-list/get-list.component';
import { ProcessComponent } from './process/process.component';

const appRoutes: Routes = [
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
		RouterModule.forChild(appRoutes),
		ModalModule.forRoot(),
		TooltipModule.forRoot(),
		TranslateModule,
		SanitizeHtmlModule,

		FroalaEditorModule.forRoot(),
		FroalaViewModule.forRoot(),

		PagebuilderModule,
		ServicePipeModule
	],
	declarations: [
		GetlistComponent,
		ProcessComponent
	],
})
export class PagesBuilderModule { }