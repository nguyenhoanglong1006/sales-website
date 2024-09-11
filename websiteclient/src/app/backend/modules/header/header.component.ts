import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { Globals } from '../../../globals';

@Component({
    selector: 'admin-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderBackendComponent implements OnInit {

    @Output('eventOpened') eventOpened = new EventEmitter<number>();
    @Output('eventLang') eventLang = new EventEmitter<boolean>();

    public company: any; connect;
    public step = 0;
    public expanded: boolean = true;
    public mutiLang: any = { active: {}, data: [] };
    public user: any = {}

    constructor(
        public globals: Globals,
        public router: Router,
    ) {
        //language- ngôn ngữ
        let language = this.globals.language.get(true);
        this.mutiLang.data = this.globals.language.getData();

        if (this.mutiLang.data.length > 0) {
            this.mutiLang.data.filter(item => {
                if (+item.id == +language) {
                    this.mutiLang.active = item
                }
                return item
            })
        };

        this.user = this.globals.USERS.get();

    }

    ngOnInit() {

    }

    onClickMenu = () => {
        this.eventOpened.emit()
    }
    onLanguage = (language_id) => {
        this.mutiLang.data.filter(item => {
            if (+item.id == +language_id) {
                this.mutiLang.active = item
            }
            return item
        })
        this.globals.language.set(language_id, true);
        this.eventLang.emit();
        this.router.navigate([this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2]]);
    }
}

