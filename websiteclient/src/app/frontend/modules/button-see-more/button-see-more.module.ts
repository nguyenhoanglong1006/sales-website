import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

import { ButtonSeeMoreComponent } from './button-see-more.component';

@NgModule({
    imports: [RouterModule, TranslateModule],
    declarations: [ButtonSeeMoreComponent],
    exports: [ButtonSeeMoreComponent],
})
export class BoxButtonSeeMoreModule {}
