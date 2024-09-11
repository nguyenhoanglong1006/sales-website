import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';

import { BoxAsidebarLeftComponent } from './box-asidebar-left.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
        SanitizeHtmlModule,
    ],
    declarations: [BoxAsidebarLeftComponent],
    exports: [BoxAsidebarLeftComponent]
})
export class BoxAsidebarLeftModule { }