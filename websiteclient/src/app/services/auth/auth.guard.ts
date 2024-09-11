import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
import { Globals } from '../../globals';

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(private loginService: LoginService, private globals: Globals) {
    }
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Observable<boolean>(obs => {
            if (this.globals.USERS.check()) {
                this.loginService.checkLoginAdmin().subscribe((resp: any) => {
                    if (resp.status == 1) {
                        this.globals.USERS.set(resp.data);
                        obs.next(true);
                    } else {
                        this.globals.USERS.remove(true);
                    }
                });
            } else {

                this.globals.USERS.remove(true);
            }
        });
    }
}
