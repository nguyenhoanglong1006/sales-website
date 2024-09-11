import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';

import { FooterComponent } from './footer.component';
import { BoxButtonSeeMoreModule } from '../button-see-more/button-see-more.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        SanitizeHtmlModule,
        BoxButtonSeeMoreModule
    ],
    declarations: [FooterComponent],
    exports: [FooterComponent]
})
export class FooterModule { }