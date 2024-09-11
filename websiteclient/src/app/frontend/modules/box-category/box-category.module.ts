import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { BoxCategoryComponent } from './box-category.component';

@NgModule({
    declarations: [BoxCategoryComponent],
    imports: [
        CommonModule,
        RouterModule,
        TranslateModule,
    ],
    exports: [BoxCategoryComponent]
})
export class BoxCategoryModule { }