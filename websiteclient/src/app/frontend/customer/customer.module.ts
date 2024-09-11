import { OrderDetailComponent } from './order-detail/order-detail.component';
import { CustomerComponent } from './customer.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ChangePassComponent } from './change-pass/change-pass.component';
import { InfoComponent } from './info/info.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { uploadFileService } from './../../services/integrated/upload.service';
import { SanitizeUrlModule } from '~/backend/sanitizeurlpipe';

const routes: Routes = [
    {
        path: '', component: CustomerComponent,
        children: [
            { path: '', redirectTo: 'tai-khoan' },
            { path: 'thong-tin', component: InfoComponent },
            { path: 'danh-sach', component: OrderListComponent },
            { path: 'mat-khau', component: ChangePassComponent },
            { path: 'danh-sach/:id', component: OrderDetailComponent },
        ],
    },
    { path: '**', redirectTo: '404' },
];

@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ModalModule,
        TooltipModule,
        BsDatepickerModule,
        SanitizeUrlModule
    ],
	providers: [uploadFileService],
    declarations: [ChangePassComponent, InfoComponent, OrderListComponent, CustomerComponent, OrderDetailComponent],
})
export class CustomerModule {}