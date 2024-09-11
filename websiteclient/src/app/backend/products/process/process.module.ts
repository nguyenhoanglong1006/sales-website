import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ProcessComponent } from './process.component';
import { InsComponent } from './ins/ins.component';
import { PictureComponent } from './picture/picture.component';
import { AttributeComponent } from './attribute/attribute.component';
import { DescriptionComponent } from './description/description.component';
import { PriceComponent } from './price/price.component';
import { numberModule } from '~/services/symbol';
import { FroalaEditorModule, FroalaViewModule } from 'angular-froala-wysiwyg';

const appRoutes: Routes = [
    {
        path: '', component: ProcessComponent,
        children: [
            {path :'' , redirectTo :'insert'},
            { path: 'insert', component: InsComponent },
            { path: 'update/:id', component : InsComponent },
            { path: 'picture/:id', component : PictureComponent },
            { path: 'price/:id', component : PriceComponent },
            // { path: 'attribute/:id', component : AttributeComponent },
            { path: 'description/:id', component : DescriptionComponent }
        ]
    }]

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(appRoutes),
        ModalModule.forRoot(),
        AlertModule.forRoot(),
        TranslateModule,
		TooltipModule.forRoot(),
        FroalaEditorModule.forRoot(),
		FroalaViewModule.forRoot(),
        numberModule
    ],
    declarations: [
        ProcessComponent,
        InsComponent,
        PictureComponent,
        PriceComponent,
        AttributeComponent,
        DescriptionComponent
    ]
})
export class ProcessModule { }
