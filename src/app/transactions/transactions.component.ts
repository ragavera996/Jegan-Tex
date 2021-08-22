import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  sum:number = 0;

  constructor() { }
  @Input() templateData: any;

  ngOnInit() {
    if(this.templateData){
      for(let i=0; i < this.templateData.length; i++){
        this.sum = this.sum + this.templateData[i].amount;
      }
    }
  }

  reload() {
    window.location.reload();
  }

}
