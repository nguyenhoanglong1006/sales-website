import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagebuilderComponent } from './pagebuilder.component';

@NgModule({
    declarations: [
        PagebuilderComponent
    ],
    imports: [
        CommonModule,
    ],
    exports: [
        PagebuilderComponent
    ],
    entryComponents: [
        PagebuilderComponent
    ]
})
export class PagebuilderModule { }
