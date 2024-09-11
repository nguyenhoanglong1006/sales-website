import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FrontendComponent } from '~/frontend/frontend.component';
import { FooterModule } from '~/frontend/modules/footer';
import { HeaderModule } from '~/frontend/modules/header';
import { CheckPageGuard } from '~/services/auth/checkpage.guard';
import { ReactiveFormsModule } from '@angular/forms';
import { LazyLoadImageModule, scrollPreset } from 'ng-lazyload-image'; // <-- include ScrollHooks


const appRoutes: Routes = [
    {
        path: '', component: FrontendComponent, canActivate: [],
        children: [
            { path: '', loadChildren: () => import('./home/home.module').then(m => m.FEHomeModule) },
            { path: 'en', loadChildren: () => import('./home/home.module').then(m => m.FEHomeModule) },
            { path: 'tin-tuc', loadChildren: () => import('./content/content.module').then(m => m.FEContentModule) },
            { path: 'san-pham', loadChildren: () => import('./products/products.module').then(m => m.ProductsModule) },
            { path: 'lien-he', loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule) },
            { path: 'dang-nhap', loadChildren: () => import('./sign-in/sign-in.module').then(m => m.SignInModule) },
            { path: 'dang-ky', loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpModule) },
            { path: 'tra-cuu-don-hang', loadChildren: () => import('./track-order/track-order.module').then(m => m.TrackOrderModule) },
            { path: 'tim-kiem', loadChildren: () => import('./search/search.module').then(m => m.FESearchModule) },
            { path: 'khach-hang', loadChildren: () => import('./customer/customer.module').then(m => m.CustomerModule) },
            { path: '404', loadChildren: () => import('./not-found/not-found.module').then(m => m.PageNotFoundModule) },
            { path: 've-chung-toi', loadChildren: () => import('./page/page.module').then(m => m.FEPageModule) },
            { path: 'gio-hang', loadChildren: () => import('./cart/cart.module').then(m => m.CartModule) },
            { path: ':link', loadChildren: () => import('./page/page.module').then(m => m.FEPageModule) },
        ]
    },
    { path: '**', redirectTo: '404' }
]

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(appRoutes),
        TranslateModule,
        ReactiveFormsModule,
        LazyLoadImageModule.forRoot({
            preset: scrollPreset // <-- tell LazyLoadImage that you want to use scrollPreset
          }),

        FooterModule,
        HeaderModule,
    ],
    declarations: [
        FrontendComponent,
    ],
    providers: [
        CheckPageGuard
    ]
})

export class FrontendModule {

}
