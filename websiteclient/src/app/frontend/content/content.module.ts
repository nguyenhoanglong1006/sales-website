import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { BindSrcDirective } from '~/services/directive/bindSrc.driective';
import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { HeadingBoxPageModule } from '~/frontend/modules/heading-box-page/heading-box-page.module';
import { BoxAsidebarLeftModule } from '~/frontend/modules/box-asidebar-left/box-asidebar-left.module';
import { BoxContenntModule } from '~/frontend/modules/box-content';
import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { BoxLoadingModule } from '~/frontend/modules/box-loading/box-loading.module';
import { ButtonBackModule } from '~/frontend/modules/button-back/button-back.module';
import { SidebarNewsModule } from '~/frontend/modules/sidebar-news/sidebar-news.module';

import { ListContentComponent } from './list/list.component';

const routes: Routes = [
    { path: '', component: ListContentComponent },
    { path: ':link', component: ListContentComponent },
    { path: ':parent_link/:link', component: ListContentComponent },
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        SanitizeHtmlModule,
        RouterModule.forChild(routes),
        PaginationModule.forRoot(),
        BsDatepickerModule.forRoot(),
        FormsModule,

        BoxContenntModule,
        BoxAsidebarLeftModule,
        BoxHeaderPageModule,
        BoxLoadingModule,
        HeadingBoxPageModule,
        ButtonBackModule,
        SidebarNewsModule
    ],
    declarations: [ListContentComponent, BindSrcDirective],
})
export class FEContentModule {}
