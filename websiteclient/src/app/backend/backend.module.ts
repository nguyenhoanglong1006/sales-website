import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';

import { TableService } from '~/services/integrated/table.service';
import { AuthorizationGuard } from '~/services/auth/authorization.guard';

import { BackendComponent } from './backend.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderBackendComponent } from './modules/header/header.component';
import { AsidebarComponent } from './modules/asidebar/asidebar.component';
import { AlertComponent } from './modules/alert/alert.component';

const appRoutes: Routes = [
    {
        path: '',
        component: BackendComponent,
        children: [
            { path: '', redirectTo: 'dashboard' },
            {
                path: 'dashboard', component: DashboardComponent,
                // canActivate: [AuthorizationGuard], 
            },
            {
                path: 'pages',
                loadChildren: () => import('./pages/pages.module').then((m) => m.PagesModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'pages-builder',
                loadChildren: () => import('./pages-builder/pages-builder.module').then((m) => m.PagesBuilderModule),

                canActivate: [AuthorizationGuard],
            },
            {
                path: 'category',
                loadChildren: () => import('./category/category.module').then((m) => m.CategoryModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'contents',
                loadChildren: () => import('./contents/contents.module').then((m) => m.ContentsModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'products',
                loadChildren: () => import('./products/products.module').then((m) => m.ProductsModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'contacts',
                loadChildren: () => import('./contacts/contacts.module').then((m) => m.ContactsModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'library',
                loadChildren: () => import('./library/library.module').then((m) => m.LibraryModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'users',
                loadChildren: () => import('./users/users.module').then((m) => m.UsersModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'customers',
                loadChildren: () => import('./customers/customers.module').then((m) => m.CustomersModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'orders',
                loadChildren: () => import('./orders/orders.module').then((m) => m.OrdersModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'faq',
                loadChildren: () => import('./faq/faq.module').then((m) => m.FaqModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'careers',
                loadChildren: () => import('./careers/careers.module').then((m) => m.CareersModule),
                canActivate: [AuthorizationGuard],
            },
            {
                path: 'settings',
                loadChildren: () => import('./settings/settings.module').then((m) => m.SettingsModule),
                canActivate: [AuthorizationGuard],
            },
        ],
    },
];
@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,
        RouterModule.forChild(appRoutes),
        TranslateModule,
    ],
    exports: [RouterModule],
    declarations: [
        AsidebarComponent,
        BackendComponent,
        DashboardComponent,
        HeaderBackendComponent,
        AlertComponent,
    ],
    providers: [TableService, AuthorizationGuard],
    entryComponents: [AlertComponent],
})
export class BackendModule { }
