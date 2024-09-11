import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowsersComponent } from './browsers.component';
import { LoginComponent } from './login/login.component';
import { ForgetComponent } from './forget/forget.component';

const appRoutes: Routes = [
    {
        path: '', component: BrowsersComponent,
        children: [
            { path: '', redirectTo: 'login' },
            { path: 'login', component: LoginComponent },
            { path: 'forget', component: ForgetComponent },
        ]
    }
]
@NgModule({
    imports: [
        CommonModule,
        TranslateModule,
        RouterModule.forChild(appRoutes),
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [
        BrowsersComponent,
        LoginComponent,
        ForgetComponent,
    ]
})
export class BrowsersModule { }
