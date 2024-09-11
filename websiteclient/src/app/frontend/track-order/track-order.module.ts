import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LazyLoadImageModule } from "ng-lazyload-image";
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { uploadFileService } from './../../services/integrated/upload.service';
import { SanitizeUrlModule } from '~/backend/sanitizeurlpipe';
import { BoxHeaderPageModule } from '~/frontend/modules/box-breadcrumb/box-header-page.module';
import { TrackOrderComponent } from './track-order.component';
import { ToslugService } from '~/services/integrated/toslug.service';

const routes: Routes = [{ path: '', component: TrackOrderComponent }];
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes),
        ModalModule,
        TooltipModule,
        BsDatepickerModule,
        SanitizeUrlModule,
        BoxHeaderPageModule,
        LazyLoadImageModule,
    ],
    providers: [uploadFileService, ToslugService],
    declarations: [TrackOrderComponent],
})
export class TrackOrderModule { }