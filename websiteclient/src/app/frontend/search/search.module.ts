import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BoxContenntModule } from '~/frontend/modules/box-content';
import { BoxProductModule } from '~/frontend/modules/box-product';
import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { BoxLoadingModule } from '~/frontend/modules/box-loading/box-loading.module';
import { SidebarNewsModule } from '~/frontend/modules/sidebar-news/sidebar-news.module';
import { SearchComponent } from './search.component';

const routes: Routes = [
    { path: ':keywords', component: SearchComponent }
]

@NgModule({
    declarations: [SearchComponent],
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        BoxLoadingModule,
        SidebarNewsModule,
        BoxHeaderPageModule,
        BoxContenntModule,
        BoxProductModule
    ]
})
export class FESearchModule { }