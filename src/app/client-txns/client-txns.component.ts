import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-client-txns',
  templateUrl: './client-txns.component.html',
  styleUrls: ['./client-txns.component.css']
})
export class ClientTxnsComponent implements OnInit {

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
