import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from "ng-lazyload-image";

import { BoxProductComponent } from './box-product.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        LazyLoadImageModule
    ],
    declarations: [BoxProductComponent],
    exports: [BoxProductComponent]
})
export class BoxProductModule { }