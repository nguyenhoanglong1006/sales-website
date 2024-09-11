import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { BoxHeaderPageComponent } from './box-header-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,

        SanitizeHtmlModule
    ],
    declarations: [BoxHeaderPageComponent],
    exports: [BoxHeaderPageComponent]
})
export class BoxHeaderPageModule { }