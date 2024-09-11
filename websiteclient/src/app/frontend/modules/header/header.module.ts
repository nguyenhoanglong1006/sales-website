import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';

import { HeaderComponent } from './header.component';
import { MenuMobileComponent } from './menu-mobile/menu-mobile.component';
import { MenuComponent } from './menu/menu.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        TranslateModule,
        LazyLoadImageModule,

        SanitizeHtmlModule,
        ModalModule.forRoot(),
    ],
    declarations: [HeaderComponent, MenuComponent, MenuMobileComponent],
    exports: [HeaderComponent],
})
export class HeaderModule {}
