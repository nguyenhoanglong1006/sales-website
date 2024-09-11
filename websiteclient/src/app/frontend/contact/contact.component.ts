import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { PageService } from '~/services/page/page.service';
import { AppService } from '~/services/app.service';
import { SupportService } from '~/services/support/support.service';
import { FooterService } from '~/services/modules/footer.service';
import { Globals } from '~/globals';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html',
    styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

    navigationSubs;

    public fm: FormGroup;

    public flag: boolean = true;

    public width: number;

    public linkMain: string = '';

    public changeCol: boolean = false;

    constructor(
        public router: Router,
        public pageService: PageService,
        private appService: AppService,
        @Inject(PLATFORM_ID) private platformId: Object,
        public globals: Globals,
        public fb: FormBuilder,
        private supportService: SupportService,
        public toastr: ToastrService,
        public footerService: FooterService,
        private sanitizer: DomSanitizer
    ) {

        this.navigationSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                let link = window.location.pathname.split('/');
                this.getLink(link)
            }
        })
    }

    getLink(link) {
        // check case: if link is detail and click menu back main link
        if (link.length == this.globals.language.lengthLink && this.linkMain == link[this.globals.language.numberLink] && this.contact.data && this.contact.data.data) {
            if (this.router.url != '') {
                let link = this.router.url.split('/');
                if (link.length == this.globals.language.lengthLink) {
                    let data = this.contact.data.data[0];
                    if (data.data.length == 0) {
                        this.router.navigate([this.globals.language._language == 'vn' ? data.href : ('en/' + data.href)]);
                    } else {
                        this.router.navigate([this.globals.language._language == 'vn' ? data.data[0].href : 'en/' + (data.data[0].href)]);
                    }
                }
            }
        }

        if (this.router.url != '' && (this.globals.language._language == 'vn' && this.router.url.split('/').length == 2) || (this.globals.language._language == 'en' && this.router.url.split('/').length == 3)) {
            this.appService.updateTags(this.router.url);
        }
    }

    ngOnInit(): void {
        if (this.router.url != '') {
            let link = this.router.url.split('/');
            this.getLink(link);
            this.linkMain = link[this.globals.language.numberLink];
            this.contact.get(link[this.globals.language.numberLink]);
        }
        if (isPlatformBrowser(this.platformId)) {
            this.width = window.innerWidth;
        }
        this.fmConfigs();
        this.getAddress();
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (window['showCollapse'] && this.width <= 576) {
                window['showCollapse']('address' + this.address.show);
            }
        }, 300);
    }

    ngOnDestroy() {
        if (this.navigationSubs) {
            this.navigationSubs.unsubscribe();
        }
    }

    public contact = {
        nameGroup: '',
        data: <any>{},
        get: (link) => {
            this.pageService.getPagesLink({ link: link }).subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.contact.data = resp.data;                    
                }
            });
        },

    }

    fmConfigs(item: any = "") {

        item = typeof item === 'object' ? item : { status: 1 };

        this.fm = this.fb.group({
            name: [''],

            email: ['', [Validators.required, Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],

            phone: ['', [Validators.pattern(/^([_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,5}))|(\d+$)$/)]],

            message: ['', [Validators.required]],
        });

    }

    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }

    getAddress(): void {
        this.footerService.getAddress().subscribe((resp: any) => this.address._ini(resp.data));
    }

    public address = {
        show: -1,
        data: [],
        _ini: (data) => {
            if (data && data.length > 0) {
                this.address.data = data;
                
                this.address.show = data[0].id;
            }
        },
        _onShow: (id) => {
            this.address.show = this.address.show != id ? id : -1;
        }
    }


    onSubmit() {
        if (this.flag) {
            this.flag = false;
            let data = this.fm.value;
            this.supportService.addContact(data).subscribe((resp: any) => {
                this.flag = true;
                let type = (resp.status == 1) ? "success" : (resp.status == 0 ? "warning" : "danger");
                this.toastr[type](resp.message, type, { closeButton: true });
                if (resp.status == 1) {
                    if (window['openModal']) {
                        window['openModal']('submitSuccessModal')
                    }
                    this.fmConfigs()
                }
            });
        }
    }
}
