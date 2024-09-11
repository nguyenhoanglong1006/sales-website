import { Injectable } from '@angular/core';

@Injectable()
export class uploadFileService {

    public typeImages = ['jpg', 'png', 'jpeg', 'svg', 'webp'];

    public typeFile = ['pdf'];

    public type: number = 1  //1: imgae 2:file;

    public data = [];

    public multiple: boolean = false;

    public limit: number;

    public sizeMax: number;

    public path: string = '';

    public action: boolean = false;

    public old = [];

    public notification: string = '';

    public message = {
        mesErrType: "Format invalid image or invalid type.",
        mesErrSize: "The file size is too large. Please check again. Max size :",
        quesDel: "Have you sure you want to delete this image?",
    }
    constructor() {
    }
    _ini(option) {
        this.multiple = (option.hasOwnProperty('multiple') && option.multiple == true) ? true : false;
        this.path = (option.hasOwnProperty('path')) ? option.path : null;
        this.limit = (option.hasOwnProperty('limit')) ? option.limit : null;
        this.type = (option.hasOwnProperty('type')) ? option.type : this.type;
        this.sizeMax = (option.hasOwnProperty('sizeMax') && !isNaN(option.sizeMax)) ? option.sizeMax : null;

        if (option.hasOwnProperty('data')) {
            let data = option.data;
            if (data === null || data == null || data == "" || data === "") { } else {
                if (this.multiple == false) {
                    let skip = this._checkType(data);
                    if (skip == true) {
                        let item = { src: this.path + data, name: data, path: this.path, action: 1, size: 0, type: 0 };
                        this.data.push(item);
                    }
                } else {
                    data = (typeof data === "object") ? data : ((data != "" && data != null && data.length > 0) ? JSON.parse(data) : []);
                    for (let i = 0; i < data.length; i++) {
                        let skip = this._checkType(data[i]);
                        if (skip == true) {
                            let item = { src: this.path + data[i], name: data[i], path: this.path, action: 1, size: 0, type: 0 };
                            this.data.push(item);
                        }
                    }
                }
            }
        }
        if ((this.multiple == false && this.data.length == 0) || this.multiple == true) {
            this.data.push({ src: null, name: null, path: this.path, action: 0, size: 0, type: 2 })
        }
    }
    _get(skip: any = "") {
        let item = { del: this.old, add: [], old: [], path: this.path, multiple: this.multiple };
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i].type == 1) {
                item.add.push({ name: this.data[i].name, src: this.data[i].src, type: this._getRegex(this.data[i].name) });
            } else if (this.data[i].type == 0) {
                item.old.push(this.data[i].name);
            }
        }
        return (skip != "" && skip == true) ? item : JSON.stringify(item)
    }

    _del(position) {

        let yn = confirm(this.message.quesDel);

        if (yn == true) {

            this.old.push(this.data[position]['name']);

            if (this.multiple == false) {

                this.data[0] = { src: null, name: null, path: this.path, action: 0, size: 0, type: 2 };

            } else {

                this.data.splice(position, 1);
            }
        }
    }

    _change(e, item) {
        item['selected'] = true;
        let pr = e.target.parentNode.parentNode;
        let txt = pr.querySelector("input[type='file']");
        if (!txt) { txt = pr.parentNode.querySelector("input[type='file']"); }
        if (txt) {
            if (this.multiple == true) { txt.removeAttribute('multiple', true); }
            this.action = true; txt.click();
        }
    }
    _push(e) {
        let pr = e.target.parentNode.parentNode;
        let txt = pr.querySelector("input[type='file']");
        if (!txt) { txt = pr.parentNode.querySelector("input[type='file']") }
        if (txt) {
            if (this.multiple == true) { txt.setAttribute('multiple', true); }
            this.action = false; txt.click();
        }
    }
    _onchange(ev) {

        let files = ev.target.files;

        let reader = new FileReader();

        if (files.length > 0) {

            let file = files[0];

            if (this._checkType(file.name) == true) {

                if (this.multiple == false) {

                    reader.onload = () => {

                        let item = this.data[0];

                        if (item.name && item.name.length > 0) {

                            this.old.push(item.name);
                        }
                        this._onPush(reader.result, file);

                        this._updateSelected();
                    }
                    if (file) {

                        reader.readAsDataURL(file);
                    }


                } else {

                    if (this.action == true) {

                        let file = files[0];

                        for (let i = 0; i < this.data.length; i++) {

                            if (this.data[i].hasOwnProperty('selected')) {

                                let item = this.data[i];

                                reader.onload = () => {

                                    if (this.sizeMax != null && this.sizeMax < file.size) {
                                        alert(this.message.mesErrSize + this.sizeMax);
                                    } else {
                                        if (item.type == 0) {
                                            this.old.push(this.data[0]['name']);
                                        }
                                        item.name = file.name;
                                        item.size = file.size;
                                        item.src = reader.result;
                                        delete item.selected;
                                    }

                                }
                                if (file) {
                                    reader.readAsDataURL(file);
                                }
                                break;
                            }
                        }
                    } else {
                        this.data.splice((this.data.length - 1), 1);

                        let readFile = (index) => {

                            if (index >= files.length) {

                                this.data.push({ src: null, name: null, path: this.path, action: 0, size: 0, type: 2 });

                                return;
                            }
                            let file = files[index];

                            reader.onload = (event) => {

                                this._onPushList(reader.result, file);

                                readFile(index + 1);
                            }
                            reader.readAsDataURL(file);
                        }
                        readFile(0);
                    }
                }
            } else {
                alert(this.message.mesErrType);
            }
        }
    }
    _onPush(src, file) {
        if (this._checkType(file.name) == true) {

            if (this.sizeMax != null && this.sizeMax < file.size) {

                alert(this.message.mesErrSize + this.sizeMax);

            } else {
                let item = this.data[0];


                item.type = 1;

                if (this.action == true && item.type == 0) {

                    this.old.push(this.data[0]['name']);
                }
                item.size = file.size;

                item.name = file.name;

                item.src = src;

                this.data[0].push(item);
                
            }

        } else {
            alert(this.message.mesErrType);
        }

    }

    _onPushList(src, file) {

        let item = { src: src, name: file.name, path: this.path, action: 0, size: file.size, type: 1 };

        if (this._checkType(file.name) == true) {

            if (this.sizeMax != null && this.sizeMax < item.size) {

                alert(this.message.mesErrSize + this.sizeMax);

            } else {
                this.data.push(item);
            }
        } else {
            alert(this.message.mesErrType);
        }
    }

    _getRegex(name) {

        if (name != '' || name != null) { return name.split(".").reverse()[0]; };

        return "";
    }

    _checkType(name) {
        let skip: boolean;

        let extension = this._getRegex(name).toLowerCase();
        switch (this.type) {
            case 1:
                skip = this.typeImages.some(x => x === extension);
                break;
            case 2:
                skip = this.typeFile.some(x => x === extension);
                break;
            default:
                break;
        }
        return skip;
    }

    _updateSelected() {

        for (var index = 0; index < this.data.length; index++) {

            if (this.data[index].hasOwnProperty('selected')) {

                delete this.data[index].selected;
                break;
            }
        }
    }

}