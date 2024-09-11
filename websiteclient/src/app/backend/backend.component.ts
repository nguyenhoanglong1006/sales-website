import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { Globals } from '../globals';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-backend',
    templateUrl: './backend.component.html',
})
export class BackendComponent implements AfterViewInit {

    public opened: boolean = true;

    public height: number = window.innerHeight;

    loadingLang = false;

    constructor(
        public translate: TranslateService,
        public globals: Globals,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        if (isPlatformBrowser(this.platformId)) {
            let language = this.globals.language.get(true) || 0;
            let data = this.globals.language.getData();
            let active: any = {}
            if (+language > 0) {
                data.filter(item => { +item.id == +language ? active = item : {}; return item })
            } else {
                data.filter(item => { +item.defaults == 0 ? active = item : {}; return item });
            }
            this.globals.language.set(active.id, true);
            this.translate.use('admin');
        }

    }

    eventOpened(e) {
        this.opened = (this.opened === true) ? false : true;
    }

    eventLang(e) {
        this.loadingLang = true
        setTimeout(() => {
            this.loadingLang = false
        }, 500);
    }

    ngAfterViewInit() {
        setTimeout(() => {
            let el = document.getElementById('facebook');
            if (el) { el.remove() }
        }, 1000);

    }
}