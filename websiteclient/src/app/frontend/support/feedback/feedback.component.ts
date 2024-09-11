import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RecaptchaErrorParameters } from 'ng-recaptcha';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { SupportService } from '~/services/support/support.service';
import { AppService } from '~/services/app.service';
import { Globals } from '~/globals';

@Component({
    selector: 'app-feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit {

    public checkCaptcha: boolean = false;

    public fm: FormGroup;

    public link

    public feedBack = {
        active: 1,
        list: [
            { title: 'FESupport.feedback.emotion1', image: '/assets/img/tamp/level1.png', value: 1 },
            { title: 'FESupport.feedback.emotion2', image: '/assets/img/tamp/level2.png', value: 2 },
            { title: 'FESupport.feedback.emotion3', image: '/assets/img/tamp/level3.png', value: 3 },
            { title: 'FESupport.feedback.emotion4', image: '/assets/img/tamp/level4.png', value: 4 },
            { title: 'FESupport.feedback.emotion5', image: '/assets/img/tamp/level5.png', value: 5 }
        ]
    }

    public width: number;

    public isBrowser: boolean;

    public flag: boolean = true;

    constructor(
        public fmBuilder: FormBuilder,
        public router: Router,
        @Inject(PLATFORM_ID) private platformId: Object,
        private supportService: SupportService,
        private appService: AppService,
        public globals: Globals
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {

        if (this.isBrowser) {
            this.width = window.innerWidth;
        }

        if (this.router.url != '') {
            this.appService.updateTags(this.router.url);
            this.link = this.router.url.split('/')[this.globals.language.numberLink];
        }

        this.fmConfigFeedback();

        this.options.getContactContent();
    }

    public options = {
        active: 1,
        type: [
            { name: 'FESupport.purposeFeedback', value: 1 },
            { name: 'FESupport.purposeError', value: 2 },
            { name: 'FESupport.purposeOther', value: 3 }
        ],
        list: [],
        contents: [],
        itemContent: <any>false,
        _ini: () => {
            this.options.contents = this.options.list.filter((resp: any) => resp.type == this.options.active);
            this.options.itemContent = this.options.contents.length > 0 ? this.options.contents[0] : false;
            this.onChangeContent(this.options.itemContent);
        },
        getContactContent: () => {
            this.supportService.getContactContent().subscribe((resp: any) => {
                if (resp.status == 1) {
                    this.options.list = resp.data;
                    this.options._ini();
                }
            });
        },
        _change: (item) => {
            this.options.active = item.value;
            this.options._ini();
        }
    }

    fmConfigFeedback(item: any = "") {

        item = (item && typeof item === 'object') ? item : { status: 1, permission_group_id: 2 };

        let config = {

            contact_content_id: null,

            name: [item.name ? item.name : '', [Validators.required, Validators.pattern(/^(?:((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:"^[\]'’,\-.\s])){1,}(['’,\-\.]){0,1})(([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:"^[\]'’,\-. ]))*(([ ]+){0,1}(((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:"^[\]'’,\-\.\s])){1,})(['’\-,\.]){0,1})((([^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:"^[\]'’,\-\.\s])))?)*)$/)]],

            phone: [item.phone ? item.phone : '', [Validators.required, Validators.minLength(10), Validators.maxLength(11)]],

            email: [item.email ? item.email : '', [Validators.pattern(/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i)]],

            message: [item.message ? item.message : '']
        }

        this.fm = this.fmBuilder.group(config);
    }

    public resolved(captchaResponse: string): void {
        this.checkCaptcha = captchaResponse != '' ? true : false;
    }

    public onError(errorDetails: RecaptchaErrorParameters): void {
        console.log(`reCAPTCHA error encountered; details:`, errorDetails);
        this.checkCaptcha = false;
    }

    onChangeContent(item) {
        this.options.itemContent = item;
        this.fm.controls['contact_content_id'].setValue(item && item.id ? item.id : 0);
    }

    onSubmit() {
        if (this.flag) {
            this.flag = false;
            let data = this.fm.value;
            data.level = this.feedBack.active;
            this.supportService.addContact(data).subscribe((resp: any) => {
                this.flag = true;
                if (resp.status == 1) {
                    if (window['openModal']) {
                        window['openModal']('submitSuccessModal')
                    }
                    this.fmConfigFeedback()
                }
            });
        }
    }
}
