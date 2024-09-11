import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { RecaptchaModule } from 'ng-recaptcha';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { HeadingBoxModule } from '~/frontend/modules/heading-box/heading-box.module';
import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { ButtonBackModule } from '~/frontend/modules/button-back/button-back.module';

import { DetailFaqComponent } from './detail-faq/detail-faq.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { MainComponent } from './main/main.component';
import { SupportComponent } from './support.component';

const routes: Routes = [
    {
        path: '',
        component: SupportComponent,
        children: [
            { path: '', component: MainComponent },
            // { path: 'gop-y', component: FeedbackComponent },
            // { path: 'feeback', component: FeedbackComponent },
            { path: 'huong-dan', loadChildren: () => import('./guide/guide.module').then((m) => m.GuideModule) },
            { path: 'guide', loadChildren: () => import('./guide/guide.module').then((m) => m.GuideModule) },

            { path: 'cac-bieu-mau', loadChildren: () => import('./guide/guide.module').then((m) => m.GuideModule), },
            { path: 'forms', loadChildren: () => import('./guide/guide.module').then((m) => m.GuideModule), },

            { path: 'quy-dinh-giao-dich', loadChildren: () => import('./guide/guide.module').then((m) => m.GuideModule) },
            { path: 'trading-regulations', loadChildren: () => import('./guide/guide.module').then((m) => m.GuideModule) },
            { path: ':link', component: DetailFaqComponent },
        ],
    },
];

@NgModule({
    declarations: [SupportComponent, MainComponent, FeedbackComponent, DetailFaqComponent],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),

        RecaptchaModule,
        SanitizeHtmlModule,
        BoxHeaderPageModule,
        HeadingBoxModule,
        ButtonBackModule
    ],
})
export class FESupportModule { }
