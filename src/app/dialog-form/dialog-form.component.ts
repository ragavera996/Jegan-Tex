import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.css'],
})
export class DialogFormComponent implements OnInit {
  dialogForm: FormGroup;
  id: number;
  name: string;
  address: string;
  phone: number;
  newDialog: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<DialogFormComponent>,
    private dialog: MatDialog,
    public snackBar: MatSnackBar
  ) {
    if (data.id === '') {
      this.id = 0;
    } else {
      this.id = data.id;
    }
    this.name = data.name;
    this.address = data.address;
    this.phone = data.phone;
  }

  ngOnInit() {
    this.dialogForm = this.formBuilder.group({
      customerId: [null, Validators.required],
      companyName: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
    });
    if (this.id === 0) {
      this.newDialog = false;
    }
    this.dialogForm.get('customerId').disable();
  }

  submit() {
    if (!this.dialogForm.valid) {
      return;
    } else {
      if (this.newDialog) {
        let respose = this.userService.updateData(
          this.dialogForm.getRawValue()
        );
        respose.subscribe((data) => {
          if (data == '1') {
            this.dialog.closeAll();
            this.snackBar.open(
              'Customer updated successfully!. Please Refresh',
              'Close'
            );
            window.location.reload();
          } else {
            this.snackBar.open('Customer updation failed!', 'Close');
          }
        });
      } else {
        let response = this.userService.createData(this.dialogForm.value);
        response.subscribe((data) => {
          if (data == '0') {
            this.snackBar.open('Customer insertion failed!', 'Close');
          } else {
            this.snackBar.open('Customer inserted successfully!', 'Close');
            window.location.reload();
          }
        });
      }
    }
  }
}
