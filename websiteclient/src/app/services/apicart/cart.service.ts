import { Injectable } from '@angular/core';
interface cartSettings {
    id: number,
    id_products: number,
    name: string;
    images?: string;
    path: string,
    amount: number,
    price: number,
    bound?: number,
    attribute: string,
}
@Injectable()
export class CartService {

    public token = "cart";
    constructor() { }
    public get = () => {
        try {
            return (window.localStorage && window.localStorage.getItem(this.token)) ? JSON.parse(window.localStorage.getItem(this.token)) : [];
        } catch (error) {
            console.log(error);
            return [];
        }

    }
    public set = (data: Array<cartSettings>) => {        
        try {
            window.localStorage.setItem(this.token, JSON.stringify(data));
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }

    }
    public reduce = () => {
        let data = this.get();
        return data.reduce((n, o, i) => { n[o.id] = o; return n }, {});
    }
    public total = () => {
        let data: any = this.get();
        return data.reduce((n, o, i) => {
            let price = (+o.price_sale == 0) ? +o.price : +o.price_sale;
            let amount = isNaN(+o.amount) ? 1 : +o.amount;
            n = (n) ? n + (price * amount) : price * amount;
            return n;
        }, 0);
    }
    public amount = () => {
        let data: any = this.get();
        return data.reduce((n, o, i) => {
            let amount = isNaN(+o.amount) ? 0 : +o.amount;
            n = (n) ? n + amount : amount;
            return n;
        }, 0);
    }
    public length = () => {
        let data: any = this.get();
        return data.length;
    }

    public edit = (item: any, id: number) => {
        let data = this.reduce();
        if (!data[id]) {
            return this.insert(item)
        } else {
            data[id] = Object.assign(data[id], item);
            return this.set(Object.values(data));
        }
    }
    public insert = (item: cartSettings) => {
        let data: any = this.reduce();
        if (item.id) {
            if (!data[item.id]) {
                data = Object.values(data);
                data.push(item)
                return this.set(data);
            } else {
                return this.edit(item, item.id)
            }
        } else {
            return false;
        }

    }
    public remove = (id) => {
        let data: any = this.reduce();
        if (data[id]) {
            let result = this.get().filter(item => {
                return item.id == id ? false : true;
            })
            return this.set(result);
        }
        return false;
    }

    public clear = () => {
        return window.localStorage.removeItem(this.token);
    }

}