import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { LazyLoadImageModule } from "ng-lazyload-image";

import { BoxContentComponent } from './box-content.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule,
        LazyLoadImageModule
    ],
    declarations: [BoxContentComponent],
    exports: [BoxContentComponent]
})
export class BoxContenntModule { }