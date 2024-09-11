import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { Globals } from '~/globals';
import { AUTHORIZATION_LIST } from '~/backend/authorization';

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.css'],
})
export class PermissionComponent implements OnInit, OnDestroy {
    private connect;
    private conf = {
        getRow: {
            path: 'users/index/getrow',
            token: 'getRowUser',
        },
        process: {
            path: 'users/index/process',
            token: 'processUser',
        },
    };

    public id: number = 0;

    public flags: boolean = false;

    data = <any>{};

    constructor(
        private globals: Globals,
        private router: Router,
        private toastr: ToastrService,
        private routerAct: ActivatedRoute,
    ) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            let type = resp.status == 1 ? 'success' : resp.status == 0 ? 'warning' : 'danger';

            switch (resp.token) {
                case this.conf.getRow.token:
                    if (resp.status == 1) {
                        
                        this.data = resp.data;

                        this.authorization._parseJson(this.data.permission);
                    }
                    break;

                case this.conf.process.token:
                    this.flags = false;

                    this.toastr[type](resp.message, type);

                    if (resp.status == 1) {
                        this.router.navigate([this.globals.admin + '/users/get-list']);
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.routerAct.params.subscribe((params) => {
            this.id = +params['id'] || 0;

            if (this.id > 0) {
                this.globals.send({
                    path: this.conf.getRow.path,
                    token: this.conf.getRow.token,
                    params: { id: this.id },
                });
            } else {
                this.router.navigate([this.globals.admin + '/users/get-list']);
            }
        });
    }

    ngOnDestroy() {
        this.connect.unsubscribe();
    }

    authorization = {
        list: JSON.parse(JSON.stringify(AUTHORIZATION_LIST)), // Deep copy
        handleCheck: (e) => e.target.checked,
        handleCheckAll: (): boolean => this.authorization.list.every((item) => item['isChecked']),
        handleCheckAllChange: (e) =>
            this.authorization.list.forEach((item) => (item['isChecked'] = e.target.checked)),
        /* _permissionAll: (isAll: boolean) =>
            this.authorization.handleCheckAllChange({ target: { checked: isAll } }), */
        _returnJson: (): string => {
            const list = this.authorization.list.reduce((prev, current) => {
                if (current['isChecked']) {
                    prev.push(current.key);
                }
                return prev;
            }, []);

            const dashboardScreenKey = AUTHORIZATION_LIST[0].key;
            (list.length && list[0] !== dashboardScreenKey) && list.unshift(dashboardScreenKey); // Permission auto into dashboard

            return JSON.stringify(list);
        },
        _parseJson: (list: Array<string>) => {
            if (!list?.length) return;

            this.authorization.list.forEach(
                (item) => (item['isChecked'] = list.findIndex((e) => e === item.key) !== -1),
            );
        },
    };

    onSubmit() {
        if (this.flags) return;

        this.flags = true;

        this.data.permission = this.authorization._returnJson();

        this.globals.send({
            path: this.conf.process.path,
            token: this.conf.process.token,
            data: this.data,
            params: { id: this.id },
        });
    }
}
