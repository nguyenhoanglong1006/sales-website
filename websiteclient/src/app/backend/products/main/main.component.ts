import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  public filter: any = {};
  public changes = (new Date()).getTime();
  constructor() { }

  ngOnInit() {
    
  }
  filterEvent(e) {
    if(this.filter[e]){
      delete this.filter[e];
    }else{
      this.filter[e] = e;
    }
    this.changes = (new Date()).getTime();
  }
}
