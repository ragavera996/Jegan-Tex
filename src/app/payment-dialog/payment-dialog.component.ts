import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-payment-dialog',
  templateUrl: './payment-dialog.component.html',
  styleUrls: ['./payment-dialog.component.css']
})
export class PaymentDialogComponent implements OnInit {

  dialogForm: FormGroup;
  id: number;
  payment: number;
  paymentType: string;
  pending: number;
  initialPending: number;
  flag: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService : UserService, @Inject(MAT_DIALOG_DATA) private data: any,public dialogRef: MatDialogRef<PaymentDialogComponent>,private dialog: MatDialog, public snackBar: MatSnackBar) { 
    this.id = data.id;
    this.pending = data.pending;
  }

  ngOnInit()  {
    this.dialogForm = this.formBuilder.group({
      id: [{value: this.id}],
      pending: [{value: this.pending, disabled:true}],
      payment: [null, Validators.required],
      paymentType: []
    });
    this.initialPending = this.pending;
  }

  updateBalance() {
    this.dialogForm.controls['pending'].setValue(this.initialPending - this.dialogForm.controls['payment'].value);
  }

  submit() {
    let respose = this.userService.updatePayment(this.dialogForm.getRawValue());
    respose.subscribe(data=>{
      if(data == "1"){
        this.dialog.closeAll();
        this.snackBar.open('Payment updated successfully!. Please Refresh', 'Close');
        window.location.reload();
      }else{
        this.snackBar.open('Payment updation failed!', 'Close');
      }
    })
   
  }

}
