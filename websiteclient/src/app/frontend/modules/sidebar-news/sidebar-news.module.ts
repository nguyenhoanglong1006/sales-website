import { Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SidebarNewsComponent } from './sidebar-news.component';

@NgModule({
    imports: [CommonModule, TranslateModule, RouterModule],
    declarations: [SidebarNewsComponent],
    exports: [SidebarNewsComponent],
})
export class SidebarNewsModule {}
