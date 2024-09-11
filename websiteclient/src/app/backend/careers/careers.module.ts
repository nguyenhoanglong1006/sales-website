import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ServicePipeModule } from '../../services/pipe';
import 'froala-editor/js/plugins.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PagebuilderModule } from '../modules/pagebuilder';
import { SanitizeHtmlModule } from '../../frontend/sanitizehtmlpipe';

import { GetlistComponent } from './get-list/get-list.component';
import { GroupComponent } from './group/group.component';
import { ProcessComponent } from './process/process.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
	{ path: '', redirectTo: 'get-list' },
	{ path: 'get-list', component: MainComponent },
	{ path: 'insert', component: ProcessComponent },
	{ path: 'update/:id', component: ProcessComponent },
]

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		ReactiveFormsModule,
		RouterModule.forChild(routes),
		ModalModule.forRoot(),
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
		GroupComponent,
		ProcessComponent,
		MainComponent,
	],
})
export class CareersModule { }
