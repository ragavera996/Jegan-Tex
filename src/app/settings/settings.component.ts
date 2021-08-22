import { Component, OnInit } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { UserService } from '../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface Size {
  name: string;
}

@Component({
  selector: 'app-setting',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{

  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  sizes:any;
  gstInput =  document.getElementById('gst-input');
  gstNumber: number;

  constructor(private userService : UserService, public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    let resp = this.userService.getSizeData();
    resp.subscribe(
      list=>{
        this.sizes = list;
      });
      let response = this.userService.getGst();
      response.subscribe((data: number)=>{
        this.gstNumber = data;
        });
  }

  addGst(gst: string){
     let response = this.userService.addGst(gst);
      response.subscribe((data)=>{
      if(data === 0){
        this.snackBar.open('GST update failed!', 'Close');
      }else {
        this.snackBar.open('GST updated successfully!', 'Close');
      }
      });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.sizes.push({name: value});
    }

    // Clear the input value
    event.chipInput!.clear();
    this.insertSize(value);
  }

  remove(size: Size): void {
    const index = this.sizes.indexOf(size);

    if (index >= 0) {
      this.sizes.splice(index, 1);
    }
    let response = this.userService.deleteSize(size.name);
     response.subscribe((data)=>{
     if(data == "0"){
       this.snackBar.open('Size deletion failed!', 'Close');
     }else {
       this.snackBar.open('Size deleted successfully!', 'Close');
     }
     });
  }

  insertSize(value){
    let response = this.userService.addSize(value);
     response.subscribe((data)=>{
     if(data == "0"){
       this.snackBar.open('Size insertion failed!', 'Close');
     }else {
       this.snackBar.open('Size inserted successfully!', 'Close');
     }
     });
  }
}
