import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { KeywordsService } from './keywords.service';

@Injectable()
export class TableService {

	public dataList = [];
	public cachedList = [];
	public data = []
	public cached = [];
	public cols = [];
	public settings: any = {};
	public pagination = [];
	public search = { field: {}, value: null, data: [], type: null };
	public filter = {};
	public params = {};
	public sorting = { field: "id", sort: "DESC", type: "" };
	public checked = [];
	public http: HttpClient;
	public keyword = new KeywordsService();
	public optionTalbe: any;
	public isLoad = true;
	public control = {};
	constructor(
	) {
		this._reset();
	}
	_ini(option) {
		let item = { skip: false, url: null, count: 50, counts: [50, 100, 200, 500], pages: 1, textpages: null, key: "id" };
		item.skip = (option.hasOwnProperty('skip')) ? option.skip : item.skip;
		item.url = (option.hasOwnProperty('url')) ? option.url : item.url;
		this.cols = (option.hasOwnProperty('cols')) ? option.cols : this.cols;
		item.count = (option.hasOwnProperty('count')) ? option.count : item.count;
		item.counts = (option.hasOwnProperty('counts')) ? option.counts : item.counts;
		item.key = (option.hasOwnProperty('key')) ? option.key : item.key;
		if (option.hasOwnProperty('params')) { this.params = option.params };
		if (option.hasOwnProperty('filter')) { this.filter = option.filter };
		if (option.hasOwnProperty('fixTalbe')) {
			if (option.fixTalbe == 'default' || typeof option.fixTalbe !== 'object') {
				this.optionTalbe = { offset: 0, eventListener: false, elementOffset: 'mat-sidenav-content', main: 'table', arri: { thead: 'thead', body: 'tbody', th: 'th', tr: 'tr', td: 'td' } };
			} else {
				this.optionTalbe = option.fixTalbe
			}
		} else {
			this.optionTalbe = null;
		}
		if (option.hasOwnProperty('optionfix')) {
			this.optionTalbe = Object.assign(this.optionTalbe, option.optionfix);
		}
		item.pages = (option.hasOwnProperty('pages')) ? option.pages : item.pages;
		this.settings = item;
		this.search.value = (option.hasOwnProperty('search')) ? option.search : this.search.value;
		this.search.type = (option.hasOwnProperty('keyword')) ? option.keyword : null;
		this.sorting = (option.hasOwnProperty('sorting')) ? option.sorting : this.sorting;
		for (let i = 0; i < this.cols.length; ++i) {
			if (this.cols[i].hasOwnProperty('filter')) {
				this.search.field[this.cols[i]['field']] = true;
			}
			if (this.sorting.field == this.cols[i]['field']) {
				this.sorting.type = this.cols[i]['type'];
			}
			if (!this.cols[i].hasOwnProperty('show')) {
				this.cols[i]['show'] = false;
			}
		}
		this._getKeyword();
		if (option.hasOwnProperty('data')) {
			this.cachedList = (option.hasOwnProperty('data')) ? option.data : this.cachedList;
			this.dataList = this.cachedList;
			this.settings['length'] = this.cachedList;
			this._process();
		} else {
			this._load();
		}
	}
	_reset() {
		this.cachedList = [];
		this.search = { field: {}, value: null, data: [], type: null };
		this.dataList = [];
		this.settings = {};
		this.cols = [];
		this.checked = [];
	}
	_load() {
		this.http.get(this.settings['url']).subscribe(response => {
			if (response['status'] == 1) {
				this.cachedList = (typeof response['data'] === 'object') ? response['data'] : JSON.parse(response['data']);
				this.dataList = this.cachedList;
				this.settings['length'] = this.cachedList.length;
				this._process();
			}
		})
	}
	_concat(data, skip: any = "") {
		this.cachedList = (skip && skip == true) ? data : this.cachedList.concat(data);
		this.dataList = this.cachedList;
		if (this.data.length == 0 || (skip && skip == true)) {
			this._process();
		} else {
			this.cached = this.dataList;
			this.settings['total'] = this.cached.length;
		}
	}
	_process(sortFilter = false) {
		this.isLoad = true;
		this.checked = [];
		let data = sortFilter ? this.data : this.dataList;
		if (this.search['value'] != '' && this.search['value'] != null && this.search['value'].length > 0) {
			data = this._processSearch(data);
		}
		if (Object.keys(this.filter).length > 0) {
			data = this._processFilter(data);
		}
		if (this.sorting['field'] != '' && this.sorting['sort'] != '') {
			data = this._processSorting(data);
		}
		this.cached = data;
		this.data = this.processReturn(data);
		if (this.optionTalbe != null) {
			if (this.optionTalbe.eventListener == true) {
				setTimeout(() => { this.fixTalbe(); }, 0);
			} else {
				setTimeout(() => { this.fixTalbe(); }, 500);
			}
		}
		this.isLoad = false;
	}
	processReturn(data) {
		let total = data.length;
		let first = (this.settings['pages'] == 1) ? 1 : (this.settings['count'] * (this.settings['pages'] - 1) + 1);
		let last = (first - 1) + this.settings['count'];
		if (total == 0 || first > total) {
			first = 0;
			last = (first - 1) + this.settings['count'];
			this.settings['pages'] = 1;
		}
		last = (last > total) ? total : last;
		this.settings['first'] = first;
		this.settings['last'] = last;
		this.settings['total'] = total;
		return data.slice((first - 1), last);
	}

	_processSearch(data) {
		let value = this.toSlug(this.search['value']);
		let fields = this.search.field;
		return data.filter(item => {
			let skip = false;
			for (let key in fields) {
				let str = (item.hasOwnProperty(key)) ? item[key] : "";
				let search = new RegExp(value, 'i');
				if (this.toSlug(str).search(search) !== -1) {
					skip = true;
					break;
				}

			}
			return skip;
		})
	}
	_processFilter(data) {
		data = data.filter((item) => { let skip = this._filterProcess(item); return skip })
		return data;
	}
	_processSorting(data) {
		let orderby = this.sorting['field'];
		let sort = (this.sorting['sort'] == 'asc') ? false : true;
		let type = (this.sorting['type'] == '' || this.sorting['type'] == null) ? "string" : this.sorting['type'];
		return data.sort(function (a, b) {
			let t1; let t2;
			switch (type) {
				case 'number':
					t1 = isNaN(+a[orderby]) ? 0 : +a[orderby];
					t2 = isNaN(+b[orderby]) ? 0 : +b[orderby];
					break;
				case 'date':
					if (!a[orderby] || a[orderby].length <= 0) {
						t1 = 0;
					} else {
						let d1 = new Date(a[orderby]);
						t1 = d1.valueOf();
					}
					if (!b[orderby] || b[orderby].length <= 0) {
						t2 = 0;
					} else {
						let d2 = new Date(b[orderby]);
						t2 = d2.valueOf();
					}
					break;
				default:
					t1 = String(a[orderby]).toLowerCase();
					t2 = String(b[orderby]).toLowerCase();
			}
			return ((t1 < t2) ? -1 : ((t1 > t2) ? 1 : 0)) * (sort ? -1 : 1);
		});
	}
	_search() {
		this._getKeyword();
		this._process();
	}
	_sorting(field, sort = "", sortFilter = false) {
		if (this.isLoad == false) {
			let skip = false;
			for (let i = 0; i < this.cols.length; i++) {
				if (this.cols[i]['field'] == field && this.cols[i]['filter'] == true) {
					this.sorting['sort'] = sort ? sort : (this.sorting['sort'] == 'asc') ? "desc" : "asc";
					this.sorting['field'] = field;
					this.sorting['type'] = this.cols[i]['type'];
					skip = true;
					break;
				}
			}
			if (skip == true) {
				this._process(sortFilter ? true : false);
			}
		}
	}
	_hiddenshow(col, e) {
		if (this.isLoad == false) {
			col['show'] = !col['show'];
			this._process();
			e.stopPropagation();
		}
	}
	_limit() {
		if (this.isLoad == false) {
			this.settings['count'] = (this.settings['count'] == 0 && this.settings['counts'].length > 0) ? this.settings['counts'][0] : this.settings['count'];
			this._process();
		}
	}
	_previousnext(skip) {
		if (this.isLoad == false) {
			let temp;
			let pages = Number(this.settings['pages']);
			let total = Number(this.settings['total']);
			let count = Number(this.settings['count']);
			if (typeof (skip) == 'boolean') {
				if (skip == true) {//next
					temp = (((pages + 1) * count) >= total) ? (((pages * count) >= total) ? pages : pages + 1) : pages + 1;
				} else {//previous
					temp = ((pages - 1) <= 1) ? ((pages > 1) ? pages - 1 : pages) : pages - 1;
				}
			}
			if (typeof (skip) == 'number') {
				temp = skip;
			}


			if (temp != pages) {
				this.settings['pages'] = Number(temp);
				this._process();
			}
		}
	}
	_checked(item, e) {
		let el = (e.target.tagName.toLowerCase() == 'input') ? e.target : e.target.getElementsByTagName("input")[0];
		if (el.checked == false) {
			this.checked.push(item);
		} else {
			let key = this.settings['key'];
			for (let i = 0; i < this.checked.length; i++) {
				if (item[key] == this.checked[i][key]) {
					this.checked.splice(i, 1);
					break;
				}
			}
		}

	}
	_chekedAll(e) {

	}
	_print() {
		let skip = this.settings['print'];
		let data = (skip === true) ? this.dataList : this.data;
		let htmlThead
		let html = "<table><table>";
	}
	_editData(data) {
		let skip = false;
		if (this.cachedList.length > 0) {
			let key = this.settings['key'];
			for (let i = 0; i < this.cachedList.length; i++) {
				if (this.cachedList[i][key] == data[key]) {
					this.cachedList[i] = this._processEditData(this.cachedList[i], data);
					skip = true;
					break;
				}
			}
			if (skip == true) {
				this.dataList = this.cachedList;
				this._process();
			}
		} else {
			skip = this._addData(data);
		}
		return skip;
	}
	_editDataList(data) {
		if (this.cachedList.length > 0) {
			let key = this.settings['key'];
			for (let i = 0; i < this.cachedList.length; i++) {
				for (let j = 0; j < data.length; j++) {
					if (this.cachedList[i][key] == data[j][key]) {
						this.cachedList[i] = this._processEditData(this.cachedList[i], data[j]);
						data.splice(j, 1);
						break;
					}
				}
			}
			for (let i = 0; i < data.length; i++) {
				this.cachedList.push(data[i]);
			}
			this.dataList = this.cachedList;
			this._process();
		} else {
			this.cachedList = data;
			this.dataList = this.cachedList;
			this._process();
		}
	}
	_processEditData(oldData, newData) {
		let data = {};
		for (let key in oldData) {
			data[key] = (newData.hasOwnProperty(key)) ? newData[key] : oldData[key];
		}
		return data;
	}
	_addData(data) {
		this.cachedList.push(data);
		this.dataList = this.cachedList;
		this._process();
		return true;
	}
	_addDataFirstRows(data) {
		data = this._setDataBeforePriorityOrderBy(data);
		this.cachedList.splice(0, 0, data);
		this.dataList = this.cachedList;
		this.priorityOrderBy();
		this._process();
		return true;
	}
	_delRowData(id) {
		let skip = false;
		if (this.cachedList.length > 0) {
			let key = this.settings['key'];
			for (let i = 0; i < this.cachedList.length; i++) {
				if (this.cachedList[i][key] == id) {
					this.cachedList.splice(i, 1);
					skip = true;
					break;
				}
			}
		}
		if (skip == true) {
			this.dataList = this.cachedList;
			this._process();
		}
		return skip;
	}
	_delListData(listId, re) {
		let objId = listId;
		let skip = false;
		if (re == false) {
			objId = {};
			for (let i = 0; i < listId.length; i++) {
				objId[listId[i]] = true;
			}
		}
		if (this.cachedList.length > 0) {
			let key = this.settings['key'];
			let data = [];
			for (let i = 0; i < this.cachedList.length; i++) {
				if (objId.hasOwnProperty(this.cachedList[i][key])) {
					skip = true;
				} else {
					data.push(this.cachedList[i]);
				}
			}
			if (skip == true) {
				this.cachedList = data;
				this.dataList = this.cachedList;
				this._process();
			}
		}
		return skip;
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
	priorityOrderBy() {
		this.sorting['sort'] = 'desc';
		this.sorting['field'] = 'time_nows';
		this.sorting['type'] = "number";
		this._process();
	}
	_setDataBeforePriorityOrderBy(data) {
		data['time_nows'] = (new Date()).valueOf();
		return data;
	}
	_focusOutSearch() {
		this.keyword.set(this.search.type, this.search.value);
	}
	_getKeyword() {
		if (this.search.type != null) {
			this.search.data = this.keyword.getKeyWord(this.search.type, this.search.value);
		}
	}
	//process filter
	_setFilter(field, value, selective, type: any = "") {
		//type in (string , number , date);
		// 1 obj = {value : [] , selective : 'between' , };// nằm trong khoản này
		// 2 obj = {value: [] , selective : 'in'};// nằm trong này
		// 3 obj = {value : [] , selective : 'notbetween'};// không nằm từ trong khoản này
		// 4 obj = {value: [] , selective : 'notin'};// không nằm trong này
		//5  obj = {value : [] , selective :'lessthan'};//nhỏ hơn
		//6  obj = {value : [] , selective : 'greaterthan'};//lớn hơn
		//7  obj = {value : [] , selective : 'notequalto'};//không bằng
		//8 obj = {value : [] , selective : 'equalto'};//bằng
		//9 obj = {value : [] , selective : 'lessthanorequalto'};//nhỏ hơn hoặc bằng
		//10 obj = {value : [] , selective : 'greaterthanorequalto'};//lớn hơn hoặc bằng
		//11 obj = {value : [] , selective : 'like'};//kết quả gần đúng
		//12 obj = {value : [] , selective : 'notlike'};//kết quả không gần đúng
		type = (!type || type == '') ? 'tring' : '';
		let row = this.cachedList[0];
		let skip = (row && row.hasOwnProperty(field)) ? true : false;
		if (skip == true) {
			if (!this.filter) { this.filter = {}; }
			if (selective == 'between' || selective == 'notbetween') {
				skip = (typeof value === 'object' && value.length == 2) ? true : false;
				if (skip == true) {
					this.filter[field] = { value: value, selective: selective, type: type };
				}
			} else if (selective == 'in' || selective == 'notin') {
				let val = (typeof value === 'object') ? value : ((value && value.length > 0) ? [value] : []);
				this.filter[field] = { value: val, selective: selective, type: type };
			}
			else {
				let val = (typeof value === 'object') ? ((value.length == 0) ? '' : value[0]) : value;
				this.filter[field] = { value: [val], selective: selective, type: type };
			}
		}
		if (skip == true) {
			this._process();
		}
		return skip;
	}
	_getFilter(field) {
		return (this.filter[field]) ? this.filter[field] : {};
	}
	_delFilter(field) {
		if (this.filter[field]) {
			delete this.filter[field];
			this._process();
		}
	}
	_filterProcess(row) {
		//let f = Object.keys(this.filter);
		let skip = true;
		for (let key in this.filter) {
			if (row.hasOwnProperty(key)) {
				let fil = this.filter[key];
				let type = fil['type'];
				let val = (typeof fil['value'] === 'object') ? fil['value'] : [];
				let selective = fil['selective'];
				switch (selective) {
					case 'between':
					case 'notbetween':
						let v0 = this.getValue(val[0], type);
						let r = this.getValue(row[key], type);
						let v1 = this.getValue(val[1], type);
						skip = (v0 <= r && r <= v1) ? (selective == 'between' ? true : false) : (selective == 'between' ? false : true);
						break;
					case 'in':
					case 'notin':
						var k = (selective == 'in') ? false : true;;
						for (var i = 0; i < val.length; i++) {
							let v = this.getValue(val[i], type);
							let r = this.getValue(row[key], type);
							if (v == r) { k = !k; break; }
						}
						skip = k;
						break;
					case 'lessthan':
						skip = (this.getValue(val[0], type) < this.getValue(row[key], type)) ? true : false;
						break;
					case 'greaterthan':
						skip = (this.getValue(val[0], type) > this.getValue(row[key], type)) ? true : false;
						break;
					case 'notequalto':
						skip = (this.getValue(val[0], type) != this.getValue(row[key], type)) ? true : false;
						break;
					case 'equalto':
						skip = (this.getValue(val[0], type) == this.getValue(row[key], type)) ? true : false;
						break;
					case 'lessthanorequalto':
						skip = (this.getValue(val[0], type) <= this.getValue(row[key], type)) ? true : false;
						break;
					case 'greaterthanorequalto':
						skip = (this.getValue(val[0], type) >= this.getValue(row[key], type)) ? true : false;
						break;
					case 'like':
						skip = (this.toSlug(row[key]).search(new RegExp(val[0], 'i')) !== -1) ? true : false
						break;
					case 'notlike':
						skip = (this.toSlug(row[key]).search(new RegExp(val[0], 'i')) !== -1) ? false : true;
						break;
					default:
						break;
				}
				if (skip == false) { break; }
			}
		}
		return skip;
	}
	getValue(val, type) {
		switch (type) {
			case 'number':
				val = isNaN(+val) ? 0 : +val;
				break;
			case 'date':
				let d = (typeof val === 'object') ? val : new Date(val);
				val = d.valueOf();
				break;
			default:

				break;
		}
		return val;
	}
	_inArray(array, key) {
		array = array.reduce((n, o, i) => { n[o] = o; return n }, {});
		return array.hasOwnProperty(key) ? true : false;
	}
	_delKeyInArray(array, key) {
		array = array.reduce((n, o, i) => { n[o] = o; return n }, {});
		array.hasOwnProperty(key) ? delete array[key] : '';
		return Object.values(array);
	}
	fixTalbe() {

		let container = document.querySelector(this.optionTalbe.elementOffset);
		let main = document.querySelector(this.optionTalbe.main);
		let tbody;
		if (container && main) {
			let thead = main.querySelector(this.optionTalbe.arri.thead);
			let tbody = main.querySelector(this.optionTalbe.arri.body);
			let tablescroll = main.querySelector(this.optionTalbe.arri.tablescroll);
			let posThead = thead.getBoundingClientRect();
			let posContainer = container.getBoundingClientRect();
			let posMain = main.getBoundingClientRect();
			container.style.overflow = 'auto';
			container.style.position = 'relative';

			let relayout = (skip: any) => {
				if (posContainer.width > 768) {
					if (tablescroll) {
						tablescroll.style.left = posMain.left + 'px';
						tablescroll.style.width = posMain.width + 'px';
					}
				}
			}
			relayout(false);
			container.scrollTop = (container.scrollTop + 100 > posContainer.height) ? container.scrollTop - 10 : container.scrollTop + 10;
			let resizeTimeout;
			let resizeThrottler = () => {
				if (!resizeTimeout) {
					resizeTimeout = setTimeout(() => {
						resizeTimeout = null;
						relayout(true);
					});
				}
			}
			let onscroll = () => {
				if (posContainer.width > 992) {
					let pos = (container.scrollTop <= (posThead.top + posThead.height)) ? 0 : (container.scrollTop + posThead.height) - posThead.top - this.optionTalbe.offset;
					thead.style.top = (container.scrollTop > (posThead.top - posContainer.top)) ? -(this.optionTalbe.offset ? +this.optionTalbe.offset : 0) + 'px' : (posThead.top - posContainer.top) - container.scrollTop - (this.optionTalbe.offset ? +this.optionTalbe.offset : 0) + 'px';
					thead.style.background = (container.scrollTop > (posThead.top - posContainer.top)) ? '#eee' : 'white';
					thead.style.transform = 'translate3d(0,' + Math.ceil(pos) + 'px,0)';
					if (tablescroll) {
						tablescroll.querySelector('div').style.width = main.getElementsByTagName('table')[0].getBoundingClientRect().width + 'px';
					}
				}

			}
			let onscrollbody = () => {
				var hTransform = 'translate3d(' + tbody.scrollLeft + 'px,0,0)';
				[].slice.call(tbody.querySelectorAll("[table-colums-fix]"))
					.forEach(function (td, i) {
						td.style.transform = hTransform;
					});
			}
			let onscrollmian = () => {
				if (tablescroll) {
					tablescroll.querySelector('div').style.width = main.getElementsByTagName('table')[0].getBoundingClientRect().width + 'px';
					tbody.scrollLeft = tablescroll.scrollLeft;
					var hTransform = 'translate3d(' + tbody.scrollLeft + 'px,0,0)';
					[].slice.call(tbody.querySelectorAll("[table-colums-fix]"))
						.forEach(function (td, i) {
							td.style.transform = hTransform;
						});
				}
			}
			let resizeThrotMain = () => {
				if (tablescroll) {
					tablescroll.style.left = posMain.left + 'px';
					tablescroll.style.width = posMain.width + 'px';
				}
			}
			if (!this.optionTalbe.eventListener || this.optionTalbe.eventListener == false) {
				container.addEventListener('scroll', onscroll, false);
				window.addEventListener('resize', resizeThrottler, false);

				if (tablescroll) {
					tablescroll.style.left = posMain.left + 'px';
					tablescroll.style.width = posMain.width + 'px';
					tablescroll.className = 'tablescroll';
					tablescroll.addEventListener('scroll', onscrollmian, false);
					main.addEventListener('resize', resizeThrotMain, false)
				} else {
					if (tbody) {
						tbody.addEventListener('scroll', onscrollbody, false);
					}
				}
				this.optionTalbe.eventListener = true;
			}
			// return {
			// 	relayout: relayout
			// }
		}

	}
}