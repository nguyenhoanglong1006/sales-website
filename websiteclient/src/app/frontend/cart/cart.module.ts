import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CartComponent } from './cart.component';
import { ModalSinginSingupComponent } from './modal-singin-singup/modal-singin-singup.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FmModule } from '../modules/fm';
import { LazyLoadImageModule } from 'ng-lazyload-image';

const appRoutes: Routes = [
  {
    path: '', component: CartComponent,
  }
]
@NgModule({
  declarations: [
    CartComponent,
    ModalSinginSingupComponent
  ],
  imports: [
    CommonModule,
    LazyLoadImageModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(appRoutes),
    ModalModule.forRoot(),
    FmModule
  ],
  entryComponents:[ModalSinginSingupComponent]
})
export class CartModule { }
