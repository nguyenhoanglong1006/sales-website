import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { BoxAsidebarLeftModule } from '~/frontend/modules/box-asidebar-left/box-asidebar-left.module';
import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { HeadingBoxPageModule } from '~/frontend/modules/heading-box-page/heading-box-page.module';
import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';

import { DetailComponent } from './detail/detail.component';
import { ServiceComponent } from './service.component';

const routes: Routes = [
    {
        path: '',
        component: ServiceComponent,
        children: [
            { path: '', component: DetailComponent },
            { path: ':link', component: DetailComponent },
            { path: ':parent_link/:link', component: DetailComponent },
        ],
    },
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
        BoxAsidebarLeftModule,
        BoxHeaderPageModule,
        HeadingBoxPageModule,
    ],
    declarations: [ServiceComponent, DetailComponent],
})
export class FEServiceModule {}
