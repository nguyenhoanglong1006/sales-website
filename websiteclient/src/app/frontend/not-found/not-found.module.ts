import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { PageNotFoundComponent } from './not-found.component';

const routes: Routes = [
    { path: '', component: PageNotFoundComponent }
]

@NgModule({

    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
    ],
    declarations: [
        PageNotFoundComponent
    ],
})
export class PageNotFoundModule { }
