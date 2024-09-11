import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { BoxAsidebarLeftModule } from '~/frontend/modules/box-asidebar-left/box-asidebar-left.module';
import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { BoxContenntModule } from '~/frontend/modules/box-content';
import { ButtonBackModule } from '~/frontend/modules/button-back/button-back.module';
import { HeadingBoxPageModule } from '~/frontend/modules/heading-box-page/heading-box-page.module';
import { SidebarNewsModule } from '~/frontend/modules/sidebar-news/sidebar-news.module';

import { DetailComponent } from './detail/detail.component';
import { PageComponent } from './page.component';

const routes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            { path: ':link', component: PageComponent },
            { path: ':parent_link/:link', component: PageComponent },
        ],
    },
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        SanitizeHtmlModule,
        RouterModule.forChild(routes),

        BoxAsidebarLeftModule,
        BoxHeaderPageModule,

        BoxContenntModule,
        HeadingBoxPageModule,
        ButtonBackModule,
        SidebarNewsModule,

        CarouselModule
    ],
    declarations: [
        PageComponent,
        DetailComponent,
    ],
})
export class FEPageModule { }
