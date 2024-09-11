import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ButtonBackComponent } from './button-back.component';

@NgModule({
    imports: [CommonModule, RouterModule, TranslateModule],
    declarations: [ButtonBackComponent],
    exports: [ButtonBackComponent],
})
export class ButtonBackModule {}
