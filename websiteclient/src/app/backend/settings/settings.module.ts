import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ServicePipeModule } from '../../services/pipe';
import { ModalModule } from 'ngx-bootstrap/modal';

import { TagsService } from '../../services/integrated/tags.service';

import { SettingsComponent } from './settings.component';
import { EmailComponent } from './email/email.component';
import { WebsiteComponent } from './website/website.component';
import { OtherComponent } from './other/other.component';
import { SanitizeUrlModule } from '../sanitizeurlpipe';
import { SitemapComponent } from './sitemap/sitemap.component';

export const routes: Routes = [
    {
        path: '', component: SettingsComponent,
        children: [
            { path: '', redirectTo: 'website' },
            { path: 'info-company', component: OtherComponent },
            { path: 'orther', component: OtherComponent },
            { path: 'social-network', component: OtherComponent },
            { path: 'email', component: EmailComponent },
            { path: 'website', component: WebsiteComponent },
            { path: 'create-sitemap', component: SitemapComponent },
            { path: 'language', loadChildren: () => import('./language/language.module').then(m => m.SettingsLanguageModule) },
            { path: 'menu', loadChildren: () => import('./menu/menu.module').then(m => m.CategoryMenuModule) },
            { path: 'contact-sale', loadChildren: () => import('./contact-sale/contact-sale.module').then((m) => m.ContactSaleModule), },

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
        SanitizeUrlModule,

    ],
    providers: [
        TagsService
    ],
    declarations: [
        SettingsComponent,
        EmailComponent,
        WebsiteComponent,
        OtherComponent,
        SitemapComponent,
    ]
})
export class SettingsModule { }
