import { Component, OnDestroy, OnInit } from '@angular/core';

import { Globals } from '~/globals';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
    private connect;
    private conf = {
        getDashboard: {
            path: 'dashboard/index/getlist',
            token: 'getDashboard',
        },
    };

    public data = [];

    constructor(public globals: Globals) {
        this.connect = this.globals.result.subscribe((resp: any) => {
            switch (resp.token) {
                case this.conf.getDashboard.token:
                    if (resp.status == 1) {
                        this.data = resp.data;
                    }
                    break;

                default:
                    break;
            }
        });
    }

    ngOnInit() {
        this.globals.send({
            path: this.conf.getDashboard.path,
            token: this.conf.getDashboard.token,
        });
    }

    ngOnDestroy() {
        this.connect.unsubscribe();
    }
}
