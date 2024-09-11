import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToslugService } from '../../services/integrated/toslug.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    providers: [ToslugService]
})
export class CategoryComponent implements OnInit {

    public list = []

    public search = {
        value: '',
        fields: ['title', 'name'],
        _keyup: (e) => {
            this.search.value = e.target.value
        }
    }

    constructor(
        private translate: TranslateService
    ) { }

    ngOnInit() {

    }

    ngAfterViewInit() {

        setTimeout(() => {

            this.list = [
                { title: this.translate.instant('settings.content'), link: 'content' },
                { title: this.translate.instant('settings.product'), link: 'product' },
                // { title: this.translate.instant('settings.library'), link: 'library' },
                { title: this.translate.instant('settings.banner'), link: 'slide' },
                { title: this.translate.instant('settings.address.list'), link: 'address' },
                { title: this.translate.instant('settings.tags.title'), link: 'tags' },
                { title: this.translate.instant('settings.redirect.title'), link: 'redirect' },
            ]
        }, 300);
    }
}
