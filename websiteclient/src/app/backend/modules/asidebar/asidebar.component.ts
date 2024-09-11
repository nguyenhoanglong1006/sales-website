import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { AUTHORIZATION_LIST } from '~/backend/authorization';

@Component({
    selector: 'admin-asidebar',
    templateUrl: './asidebar.component.html',
    styleUrls: ['./asidebar.component.css']
})
export class AsidebarComponent implements OnInit {
    @Input('opened') opened: boolean;

    authorizationList = JSON.parse(JSON.stringify(AUTHORIZATION_LIST)); // Deep copy

    constructor(private globals: Globals, private toastr: ToastrService) {
        const { authorization } = this.globals.USERS.get();

        if (!authorization || !authorization.length) {
            const message = {
                type: 'warning', title: 'Tài khoản không có quyền vào hệ thống.',
            }
            this.toastr[message.type](message.title, message.type);

            this.globals.USERS.remove(true);
            
        } else {

            this.authorizationList.forEach((item) => (item['isChecked'] = authorization.findIndex((e) => e === item.key) !== -1));
        }
    }

    ngOnInit() {}
}