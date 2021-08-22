import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css']
})
export class CreateFormComponent implements OnInit {
  loginForm: FormGroup;
  insertFlag: any;
  alphaNumericRegx = /^[\w]+([-_\s]{1}[a-z0-9]+)*$/i
  alphaRegx = /^[\w]+([-_\s]{1}[a-z]+)*$/i
  userName =  document.getElementById('user-input');

  constructor(private formBuilder: FormBuilder, private userService : UserService, public snackBar: MatSnackBar, private dialog: MatDialog) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      companyName: [null, [Validators.required, Validators.pattern(this.alphaNumericRegx)]],
      phone: [null, Validators.required],
      address: [null, [Validators.required, Validators.pattern(this.alphaRegx)]]
    });
  }

  submit() {
    if (!this.loginForm.valid) {
      return;
    }else{
     let response = this.userService.createData(this.loginForm.value);
     response.subscribe((data)=>{
     if(data == "0"){
       this.snackBar.open('Customer insertion failed!', 'Close');
     }else {
      window.location.reload(); 
       this.snackBar.open('Customer inserted successfully!', 'Close');
     }
     });
    }
  }

}
