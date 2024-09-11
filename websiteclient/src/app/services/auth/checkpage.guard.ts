import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Globals } from '~/globals';

@Injectable()
export class CheckPageGuard implements CanActivate {
    constructor(private http: HttpClient, private globals: Globals, private location: Location) { }
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Observable<boolean>((obs) => {
            let link_page = this.location.path().split('/').reverse()[0];
            if (link_page != '' && link_page != 'en') {
                this.http
                    .get(
                        this.globals.BASE_API_URL +
                        'api/page/checktypepage' +
                        this.globals._params.process({ link: link_page }),
                        this.globals.headersReject,
                    )
                    .subscribe((resp: any) => {
                        this.globals._browser.isPageBuilder = resp.status == 1 ? true : false;
                        obs.next(true);
                    });
            } else {
                obs.next(true);
            }
        });
    }
}
