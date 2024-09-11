import { Pipe, PipeTransform } from '@angular/core';
import { ToslugService } from '../integrated/toslug.service';

@Pipe({
    name: 'servicePipeFilter'
})

export class servicePipeFilter implements PipeTransform {

    constructor(public toSlug: ToslugService) { }

    transform(data: any[], valueSearch: string, field: any = []): any[] {

        if (!data) return [];

        if (!valueSearch) return data;
        return Object.values(data).filter((item: any) => {
            let skip = false;
            for (let i = 0; i < field.length; i++) {
                const keys = field[i];
                if (item[keys] && this.toSlug._ini(item[keys]).search(new RegExp(this.toSlug._ini(valueSearch), 'i')) !== -1) {
                    skip = true;
                    break;
                }
            }
            return skip;
        });
    }
}