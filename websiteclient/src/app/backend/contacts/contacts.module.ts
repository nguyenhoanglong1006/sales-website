import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import 'froala-editor/js/plugins.pkgd.min.js';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';
import { PagebuilderModule } from '../modules/pagebuilder';
import { SanitizeHtmlModule } from '../../frontend/sanitizehtmlpipe';

import { GetlistComponent } from './getlist/getlist.component';
import { InfoContactComponent } from './info-contact/info-contact.component';


const contactRoute: Routes = [
    { path: '', redirectTo: 'get-list' },
    { path: 'get-list', component: GetlistComponent },
    { path: 'info-contact/:id', component: InfoContactComponent },
]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(contactRoute),
        ModalModule.forRoot(),
        TranslateModule,

        FroalaEditorModule.forRoot(),
        FroalaViewModule.forRoot(),

        PagebuilderModule,
        SanitizeHtmlModule,

    ],
    declarations: [
        GetlistComponent,
        InfoContactComponent
    ],
    providers: []
})
export class ContactsModule { }
