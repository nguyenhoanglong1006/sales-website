import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { Globals } from '~/globals';
import { AUTHORIZATION_LIST } from '~/backend/authorization';

export const validAuthorization = () => {
    const screen = window.location.pathname.split('/')[2];
    const { key } = AUTHORIZATION_LIST.find((a) => a.link === screen) || {};

    const { authorization } = JSON.parse(window.localStorage.getItem('localStorage'));

    const authorized = authorization.findIndex((item) => key === item) !== -1;
    const { link } = AUTHORIZATION_LIST.find((item) => authorization[0] === item.key);

    return [authorized, link];
};

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private globals: Globals, private router: Router) {}

    canActivate(): Observable<boolean> {
        return new Observable<boolean>((observe) => {
            const [authorized, link] = validAuthorization();

            authorized ? observe.next(true) : this.router.navigate([this.globals.admin + '/' + link]);
        });
    }
}
