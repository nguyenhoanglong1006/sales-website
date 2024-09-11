import { Injectable } from '@angular/core';

@Injectable()
export class TagsService {
    public dataList = [];
    public _value = "";
    constructor() { }
    _set(data = "") {
        try {
            this.dataList = (!data || data == "" || data == null) ? [] : ((typeof data === "object") ? data : JSON.parse(data));
        } catch (error) {

            this.dataList = [];
        }

    }
    _get(skip = "") {
        if (!skip || skip == "") {
            return JSON.stringify(this.dataList);
        }
        return this.dataList;
    }
    _push(value) {
        if (this.dataList.length > 0) {
            let skip = true;
            for (let i = 0; i < this.dataList.length; i++) {
                if (this.dataList[i].toLowerCase() == value.toLowerCase()) {
                    skip = false;
                    break;
                }
            }
            if (skip == true) {
                this.dataList.push(value);
            }
            return skip;
        } else {
            this.dataList.push(value);
            return true;
        }
    }
    _remove(value) {
        let skip = false;
        for (let i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i].toLowerCase() == value.toLowerCase()) {
                this.dataList.splice(i, 1);
                skip = true;
                break;
            }
        }
        return skip;
    }
    _keyup(e) {
        if (e.target.value && e.target.value.length > 1 && (e.which === 13 || e.which == 13)) {
            let is = this._push(e.target.value);
            if (is == true) {
                e.target.value = "";
            }
            e.preventDefault();
            e.stopPropagation();
        }
    }
    _change(e) {
        let is = this._push(e.target.value);
        if (is == true) {
            e.target.value = "";
        }
        e.preventDefault();
        e.stopPropagation();
    }
    _selected(value) {
        let skip = this._remove(value);
        if (skip == true) {
            this._value = value;
        }
    }
}