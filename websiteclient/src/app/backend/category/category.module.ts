import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServicePipeModule } from '../../services/pipe';

import { TagsService } from '../../services/integrated/tags.service';

import { CategoryComponent } from './category.component';
import { SanitizeUrlModule } from '../sanitizeurlpipe';

export const routes: Routes = [
    {
        path: '', component: CategoryComponent,
        children: [
            { path: '', redirectTo: 'content/get-list' },
            { path: 'content', loadChildren: () => import('./pages/pages.module').then(m => m.CategoryPagesModule) },
            { path: 'product', loadChildren: () => import('./pages/pages.module').then(m => m.CategoryPagesModule) },
            { path: 'library', loadChildren: () => import('./pages/pages.module').then(m => m.CategoryPagesModule) },
            { path: 'analysis-center', loadChildren: () => import('./pages/pages.module').then(m => m.CategoryPagesModule) },
            { path: 'shareholder', loadChildren: () => import('./pages/pages.module').then(m => m.CategoryPagesModule) },
            { path: 'tags', loadChildren: () => import('./tags/tags.module').then(m => m.CategoryTagsModule) },
            { path: 'redirect', loadChildren: () => import('./redirect/redirect.module').then(m => m.CategoryRedirectModule) },
            { path: 'slide', loadChildren: () => import('./slide/slide.module').then(m => m.SlideModule) },
            { path: 'company', loadChildren: () => import('./company/company.module').then(m => m.CategoryCompanyModule) },
            { path: 'address', loadChildren: () => import('./address/address.module').then(m => m.SettingsAddressModule) },
            // { path: 'event-type', loadChildren: () => import('./event-type/event-type.module').then(m => m.CategoryEventTypeModule) },
            // { path: 'contact-content', loadChildren: () => import('./contact-content/contact-content.module').then(m => m.CategoryContactContentModule) },
        ]
    },
];
@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        TranslateModule,
        ReactiveFormsModule,
        ServicePipeModule,
        SanitizeUrlModule
    ],
    providers: [
        TagsService
    ],
    declarations: [
        CategoryComponent
    ]
})
export class CategoryModule { }
