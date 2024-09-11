import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeadingBoxComponent } from './heading-box.component';

@NgModule({
    imports: [CommonModule],
    declarations: [HeadingBoxComponent],
    exports: [HeadingBoxComponent],
})
export class HeadingBoxModule {}
