import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { BoxAsidebarLeftModule } from '~/frontend/modules/box-asidebar-left/box-asidebar-left.module';

import { GuideComponent } from './guide.component';
import { DetailComponent } from './detail/detail.component';
import { HeadingBoxPageModule } from '~/frontend/modules/heading-box-page/heading-box-page.module';

const routes: Routes = [
    {
        path: '', component: GuideComponent,
        children: [
            { path: ':link', component: DetailComponent },
            { path: ':parent_link/:link', component: DetailComponent },
            { path: ':parent_links/:parent_link/:link', component: DetailComponent },
        ]
    },
]

@NgModule({
    declarations: [
        GuideComponent,
        DetailComponent
    ],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SanitizeHtmlModule,
        BoxAsidebarLeftModule,
        HeadingBoxPageModule
    ]
})
export class GuideModule { }
