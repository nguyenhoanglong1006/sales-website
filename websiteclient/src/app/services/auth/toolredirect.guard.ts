import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { Location } from "@angular/common";
import { Globals } from "../../globals"

@Injectable()
export class ToolRedirectGuard implements CanActivate {
    constructor(private globals: Globals, private location: Location) {
    }
    canActivate(): Observable<boolean> | Promise<boolean> | boolean {
        return new Observable<boolean>(obs => {
            if (this.globals.language._language_id == 0) {
                this.globals.language._language_id = (this.location.path().split('/')[1] == 'en') ? 2 : 1;
                this.globals.language._language = (this.globals.language._language_id == 1) ? 'vn' : this.location.path().split('/')[1];
                this.globals.language.numberLink = (this.globals.language._language_id == 1) ? 1 : 2;
                this.globals.language.lengthLink = (this.globals.language._language_id == 1) ? 2 : 3;
            }
            obs.next(true);
        });
    }
}