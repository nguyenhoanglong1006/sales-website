import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { readFileSync } from 'fs';
import { Observable, Observer } from 'rxjs';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

export function universalLoader(): TranslateLoader {
    return {
        getTranslation: (lang: string) => {
            return new Observable((observer: Observer<any>) => {
                observer.next(
                    JSON.parse(readFileSync(`./dist/assets/i18n/${lang}.json`, 'utf8')),
                );
                observer.complete();
            });
        },
    } as TranslateLoader;
}

@NgModule({
    imports: [
        BrowserModule.withServerTransition({ appId: 'app-root' }),
        AppModule,
        ServerModule,
        NoopAnimationsModule,
        ServerTransferStateModule,
        TranslateModule.forRoot({
            loader: { provide: TranslateLoader, useFactory: universalLoader },
        }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppServerModule { }
