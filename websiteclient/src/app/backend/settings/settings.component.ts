import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { Globals } from '~/globals';
import { validAuthorization } from '~/services/auth/authorization.guard';
import { ToslugService } from '../../services/integrated/toslug.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    providers: [ToslugService]
})
export class SettingsComponent implements OnInit {

    public list = []

    public search = {
        value: '',
        fields: ['title', 'name'],
        _keyup: (e) => {
            this.search.value = e.target.value
        }
    }

    constructor(
        private translate: TranslateService,
        private router: Router,
        private globals: Globals,
    ) { }

    ngOnInit() {
        const [authorized, link] = validAuthorization();
        if (!authorized) this.router.navigate([this.globals.admin + '/' + link]);
    }

    ngAfterViewInit() {

        setTimeout(() => {

            this.list = [
                { group: this.translate.instant('settings.application') },
                { title: this.translate.instant('settings.website.website'), link: 'website' },
                { title: this.translate.instant('settings.email.smtp'), link: 'email' },
                { title: this.translate.instant('settings.menu.title'), link: 'menu' },
                { title: this.translate.instant('settings.infoCompany'), link: 'info-company' },
                { title: this.translate.instant('settings.socialNetwork'), link: 'social-network' },
                { title: this.translate.instant('settings.createSitemap'), link: 'create-sitemap' },
                // { title: this.translate.instant('settings.language.name'), link: 'language' },
                { title: this.translate.instant('settings.sale'), link: 'contact-sale' },
                { title: this.translate.instant('settings.other'), link: 'orther' },
            ]
        }, 300);
    }
}
