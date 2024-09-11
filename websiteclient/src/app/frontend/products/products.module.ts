import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TabsModule, } from "ngx-bootstrap/tabs";
import { TimepickerModule, } from "ngx-bootstrap/timepicker";
import { CarouselModule } from 'ngx-owl-carousel-o';
import { Ng5SliderModule } from 'ng5-slider';
import { CollapseModule } from "ngx-bootstrap/collapse";
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { HeadingBoxPageModule } from '~/frontend/modules/heading-box-page/heading-box-page.module';
import { BoxAsidebarLeftModule } from '~/frontend/modules/box-asidebar-left/box-asidebar-left.module';
import { BoxContenntModule } from '~/frontend/modules/box-content';
import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { BoxLoadingModule } from '~/frontend/modules/box-loading/box-loading.module';
import { ButtonBackModule } from '~/frontend/modules/button-back/button-back.module';
import { SidebarNewsModule } from '~/frontend/modules/sidebar-news/sidebar-news.module';
import { ListProductComponent } from './getlist/list.component';
import { DetailProductComponent } from './detail/detail.component';
import { BoxProductModule } from './../modules/box-product/box-product.module';

const routes: Routes = [
    { path: '', component: ListProductComponent },
    { path: ':link', component: ListProductComponent },
    { path: ':parent_link/:link', component: DetailProductComponent },
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
        CarouselModule,
        Ng5SliderModule,
        ReactiveFormsModule,
        CollapseModule,
        TimepickerModule,
        TabsModule,
        LazyLoadImageModule,

        BoxProductModule,
        BoxContenntModule,
        BoxAsidebarLeftModule,
        BoxHeaderPageModule,
        BoxLoadingModule,
        HeadingBoxPageModule,
        ButtonBackModule,
        SidebarNewsModule
    ],
    declarations: [DetailProductComponent, ListProductComponent],
})
export class ProductsModule { }
