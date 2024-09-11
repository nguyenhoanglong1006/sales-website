import { Injectable } from '@angular/core';
@Injectable()
export class KeywordsService {
    private limit = {show : 5 , save : 10};
    constructor() { }
    get(type) {
        let data = [];
        if (localStorage.getItem(type)) {
            let obj = localStorage.getItem(type);
            data = (typeof obj === 'object') ? obj : (obj.length > 1 ? JSON.parse(obj) : []);
        }
        return data;
    }
    set(type, val) {
        if (val != null && val.length > 1) {
            let data = this.get(type);
            let count = data.length;
            if (data.length > this.limit.save) {
                let start = data.length - this.limit.save;
                data.splice(start, data.length);
            }
            for(let i = 0 ; i < data.length;i++){
                if(data[i]===val){  data.splice(i,1);  break; }
            }
            data.push(val);
            localStorage.setItem(type, JSON.stringify(data));
        }
    }
    getKeyWord(type, val) {
        val = this.toSlug(val);
        let data = this.get(type);
        return data.filter(item => {
            return (this.toSlug(item).search(val) !== -1) ? true : false;
        }).reverse().splice(0,this.limit.show);
    }
    toSlug(string) {
        if (!string || string == null || string === 'undefined') {
            return ""
        };
        let slug = string.toString().toLowerCase();
        slug = slug.replace(/á|à|ả|ạ|ã|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/gi, 'a');
        slug = slug.replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/gi, 'e');
        slug = slug.replace(/i|í|ì|ỉ|ĩ|ị/gi, 'i');
        slug = slug.replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/gi, 'o');
        slug = slug.replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/gi, 'u');
        slug = slug.replace(/ý|ỳ|ỷ|ỹ|ỵ/gi, 'y');
        slug = slug.replace(/đ/gi, 'd');
        slug = slug.replace(/\`|\~|\!|\@|\#|\||\$|\%|\^|\&|\*|\(|\)|\+|\=|\,|\.|\/|\?|\>|\<|\'|\"|\:|\;|_/gi, '');
        return slug;
    }
}
