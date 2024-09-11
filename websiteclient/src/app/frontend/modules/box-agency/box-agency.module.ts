import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BoxAgencyComponent } from './box-agency.component';

@NgModule({
    declarations: [BoxAgencyComponent],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        // SanitizeHtmlPipe
    ],
    exports: [BoxAgencyComponent]
})
export class BoxAgencyModule { }