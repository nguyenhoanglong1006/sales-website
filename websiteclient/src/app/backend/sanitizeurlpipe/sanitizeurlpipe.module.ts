import { NgModule } from '@angular/core';
import { SanitizeUrlPipe } from '../../services/sanitizeUrl.pipe';


@NgModule({
    imports: [

    ],

    declarations: [
        SanitizeUrlPipe
    ],

    exports: [
        SanitizeUrlPipe
    ],

    providers: [
        SanitizeUrlPipe
    ]
})
export class SanitizeUrlModule { }