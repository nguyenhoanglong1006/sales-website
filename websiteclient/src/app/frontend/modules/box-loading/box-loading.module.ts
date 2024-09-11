import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';

import { BoxLoadingComponent } from './box-trading.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        SanitizeHtmlModule,
    ],
    declarations: [BoxLoadingComponent],
    exports: [BoxLoadingComponent]
})
export class BoxLoadingModule { }