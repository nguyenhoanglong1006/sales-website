import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminAuthGuard } from './services/auth/auth.guard';
import { ToolRedirectGuard } from './services/auth/toolredirect.guard';

const routes: Routes = [
    {
        path: 'admin',
        loadChildren: () => import('./backend/backend.module').then((m) => m.BackendModule),
        canActivate: [AdminAuthGuard],
    },
    { path: 'login', redirectTo: 'browsers' },
    {
        path: 'browsers',
        loadChildren: () => import('./browsers/browsers.module').then((m) => m.BrowsersModule),
    },

    {
        path: '',
        loadChildren: () => import('./frontend/frontend.module').then((m) => m.FrontendModule),
        canActivate: [ToolRedirectGuard],
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
    providers: [AdminAuthGuard, ToolRedirectGuard],
})
export class AppRoutingModule { }
