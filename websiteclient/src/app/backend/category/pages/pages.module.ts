import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule, } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ServicePipeModule } from '../../../services/pipe';
import { GetListTypeComponent } from './get-list-type/get-list-type.component';
import { ProcessTypeComponent } from './process-type/process-type.component';

import 'froala-editor/js/plugins.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { SanitizeUrlModule } from '../../sanitizeurlpipe';
import { PagebuilderModule } from '../../modules/pagebuilder';
import { SanitizeHtmlModule } from '../../../frontend/sanitizehtmlpipe';

const routes: Routes = [
    { path: '', redirectTo: 'get-list' },
    { path: 'get-list', component: GetListTypeComponent },
    { path: 'insert', component: ProcessTypeComponent },
    { path: 'update/:id', component: ProcessTypeComponent },
];

@NgModule({
    declarations: [
        GetListTypeComponent,
        ProcessTypeComponent,
    ],
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ServicePipeModule,

        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),
        SanitizeUrlModule,
        PagebuilderModule,
        SanitizeHtmlModule
    ]
})
export class CategoryPagesModule { }
