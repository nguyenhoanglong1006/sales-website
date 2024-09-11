import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { BoxAsidebarLeftModule } from '~/frontend/modules/box-asidebar-left/box-asidebar-left.module';
import { SanitizeHtmlModule } from '~/frontend/sanitizehtmlpipe';
import { BoxAnalysisModule } from '~/frontend/modules/box-analysis/box-analysis.module';
import { BoxLoadingModule } from '~/frontend/modules/box-loading/box-loading.module';
import { ButtonBackModule } from '~/frontend/modules/button-back/button-back.module';

import { DetailEduComponent } from './detail/detail.component';
import { ListEduComponent } from './list/list.component';
import { MainComponent } from './main/main.component';

const routes: Routes = [
    {
        path: '',
        component: MainComponent,
        children: [
            { path: '', component: ListEduComponent },
            { path: ':link', component: ListEduComponent },
            { path: ':parent_link/:link', component: DetailEduComponent },
            { path: ':parent_links/:parent_link/:link', component: DetailEduComponent },
        ],
    },
];

@NgModule({
    declarations: [ListEduComponent, DetailEduComponent, MainComponent],
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        SanitizeHtmlModule,
        BoxAsidebarLeftModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),

        BoxLoadingModule,
        BoxAnalysisModule,
        ButtonBackModule,
    ],
})
export class EduModule {}
