import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SanitizeUrlModule } from '../sanitizeurlpipe';
import { ServicePipeModule } from '../../services/pipe';
import 'froala-editor/js/plugins.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PagebuilderModule } from '../modules/pagebuilder';
import { SanitizeHtmlModule } from '../../frontend/sanitizehtmlpipe';

import { GetlistComponent } from './get-list/get-list.component';
import { GroupContentComponent } from './group/group.component';
import { ProcessContentComponent } from './process/process.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
	{ path: '', redirectTo: 'get-list' },
	{ path: 'get-list', component: MainComponent },
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
		SanitizeUrlModule,
		SanitizeHtmlModule,
		PagebuilderModule
	],
	declarations: [
		GetlistComponent,
		GroupContentComponent,
		ProcessContentComponent,
		MainComponent,
	],
})
export class ContentsModule { }
