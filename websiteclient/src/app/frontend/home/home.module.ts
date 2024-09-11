import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ModalModule } from 'ngx-bootstrap/modal';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { BoxCategoryModule } from '~/frontend/modules/box-category';
import { HeadingBoxModule } from '~/frontend/modules/heading-box/heading-box.module';
import { BoxAgencyModule } from '~/frontend/modules/box-agency/box-agency.module';
import { BoxButtonSeeMoreModule } from '~/frontend/modules/button-see-more/button-see-more.module';
import { BoxProductModule } from './../modules/box-product/box-product.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';

import { SlideComponent } from './slide/slide.component';
import { HomeComponent } from './home.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BoxContenntModule } from '../modules/box-content';

const routes: Routes = [{ path: '', component: HomeComponent }];

@NgModule({
    declarations: [HomeComponent, SlideComponent],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        CarouselModule,
        ModalModule.forRoot(),
        RouterModule.forChild(routes),

        SanitizeHtmlModule,
        LazyLoadImageModule,

        BoxProductModule,
        BoxContenntModule,
        BoxAgencyModule,
        BoxCategoryModule,
        BoxButtonSeeMoreModule,
        HeadingBoxModule,
        BsDropdownModule.forRoot(),
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class FEHomeModule {}
