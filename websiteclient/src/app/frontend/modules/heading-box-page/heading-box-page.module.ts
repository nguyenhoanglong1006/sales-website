import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeadingBoxPageComponent } from './heading-box-page.component';

@NgModule({
    imports: [CommonModule],
    declarations: [HeadingBoxPageComponent],
    exports: [HeadingBoxPageComponent],
})
export class HeadingBoxPageModule {}
