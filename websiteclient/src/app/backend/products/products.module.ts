import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ModalModule, BsModalRef } from 'ngx-bootstrap/modal';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

import { SanitizeUrlModule } from '../sanitizeurlpipe';
import { ServicePipeModule } from '~/services/pipe';
import { GetlistComponent } from './get-list/get-list.component';
import { MainComponent } from './main/main.component';
import { GroupProductComponent } from "./group/group.component";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';


const appRoutes: Routes = [

	{ path: '', redirectTo: 'get-list' },
	{ path: 'get-list', component: MainComponent },
	{ path: 'process', loadChildren: () => import('./process/process.module').then((m) => m.ProcessModule) },

]

@NgModule({
	imports: [
	
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		RouterModule.forChild(appRoutes),
		ModalModule.forRoot(),
		TranslateModule,
		TooltipModule.forRoot(),

		FroalaEditorModule.forRoot(),
		FroalaViewModule.forRoot(),

		ServicePipeModule,
		SanitizeUrlModule,
		SanitizeHtmlModule,
	],
	providers: [
		BsModalRef,
	],
	declarations: [
		GetlistComponent,
		GroupProductComponent,
		MainComponent,
	]
})
export class ProductsModule { }
