import { Injectable } from '@angular/core';

@Injectable()
export class AutofocusService {
    public cached : any = [];
    public data : any = [];
    public step = 0;
    public item = {};
    public value = "";
    public cols :any = [];
    public select : any = {};
    public config = {bindKey : 'id' , bindName : 'name'};
    public focus : boolean = false;
    constructor() { }

    public ini = (option) => {
        this.cached = option.data ? option.data : [];
        this.cols = (option.cols) ? option.cols : [];
        this.select = (option.select) ? option.select :  this.select;
        this.config.bindKey = (option.bindKey) ? option.bindKey : 'id';
        this.config.bindName = (option.bindName) ? option.bindName : 'name';
    }
    public onFocus(event){
        
        let code  = event.which || event.keyCode;
        if(code == 38 || code == 40){
            if(this.step == (this.data.length - 1)){
                this.step = (code == 38) ? this.step - 1 : 0;
            }else{
                if(this.step == 0){
                    this.step = (this.data.length == 0) ? 0 : (code == 40 ? this.step + 1 : this.data.length - 1);
                }else{
                    this.step = (code == 38) ? this.step - 1 : this.step + 1;
                }
            }
            this.item = this.data[this.step];
        }else{
            if(code == 13){
                if(Object.keys(this.item).length > 0){
                    this.onSelect(this.item);
                }
            }else{
                if(this.value && this.value.length > 0){
                    let vals = this.value.toLocaleLowerCase();
                    let search = new RegExp(vals, 'i');
                    this.data = this.cached.filter(item =>{
                        let skip = false;
                        for(var i = 0 ; i < this.cols.length;i++){
                            if(item[this.cols[i]]){
                                if (item[this.cols[i]].toLocaleLowerCase().search(search) !== -1) {
                                    skip = true;
                                    break;
                                }
                            }
                        }
                        return skip;
                    })
                }else{
                    this.data = [];
                }
                this.item = (this.data.length > 0 ) ? this.data[0] : {};
                this.step = 0;
            }
            
        }
    }
    public onSelect(item : any=""){
        this.select = item;
        
        this.onFocusOutTo(true);
    }
    public onFocusOutTo(skip : boolean){
        this.data = [];
        if(skip && skip == true){
            this.value = this.select[this.config.bindName];
            this.focus = false;
        }else{
            setTimeout(() => {
                if(this.value != this.select[this.config.bindName]){
                    this.value = this.select[this.config.bindName];
                }
                this.focus = false;
            }, 1000);
        }
       
    }
    
}
