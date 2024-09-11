import { NgModule } from '@angular/core';

import { SanitizeHtmlPipe } from '~/services/sanitizeHtml.pipe';

@NgModule({
    imports: [],
    declarations: [SanitizeHtmlPipe],
    exports: [SanitizeHtmlPipe],
    providers: [SanitizeHtmlPipe],
})
export class SanitizeHtmlModule {}
