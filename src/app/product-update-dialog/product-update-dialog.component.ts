import { Component, OnInit,Inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-update-dialog',
  templateUrl: './product-update-dialog.component.html',
  styleUrls: ['./product-update-dialog.component.css']
})
export class ProductUpdateDialogComponent implements OnInit {
  dialogForm: FormGroup;
  id: number;
  name: string;
  size: string;
  price: number;
  psId: number;
  newDialog: boolean = true;
  productForm: FormGroup;
  productItems: FormArray;
  alphaNumericRegx = /^[\w]+([-_\s]{1}[a-z0-9]+)*$/i
  alphaRegx = /^[\w]+([-_\s]{1}[a-z]+)*$/i

  constructor(private formBuilder: FormBuilder, private userService : UserService, @Inject(MAT_DIALOG_DATA) private data: any,public dialogRef: MatDialogRef<ProductUpdateDialogComponent>,private dialog: MatDialog, public snackBar: MatSnackBar) { 
    if(data.id === ''){
      this.id =0;
    }else {
      this.id = data.id;
    }
    this.name = data.name;
    this.size = data.size;
    this.price = data.price;
    this.psId = data.psId;
  }

  ngOnInit()  {
    this.dialogForm = this.formBuilder.group({
      // userId: [{value: this.id, disabled:true}],
      productId: [null, Validators.required],
      productPriceId: [null, Validators.required],
      productName: [null, Validators.required],
      size: [null, Validators.required],
      price: [null, Validators.required]
    });
    if (this.id === 0) {
      this.newDialog = false;
      this.productForm = new FormGroup({
        productName: new FormControl('', [Validators.required]),
        productItems: new FormArray([])
      });
      this.addItem();
    } else {
    this.dialogForm.get('productId').disable();
    this.dialogForm.get('productPriceId').disable();
    }
  }

  addItem(): void {
    this.productItems = this.productForm.get('productItems') as FormArray;
    this.productItems.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      size: [null, Validators.required],
      price: [null, Validators.required]
    });
  }

  deleteItem(i: any): void {
    this.productItems = this.productForm.get('productItems') as FormArray;
    this.productItems.removeAt(i);
  }

  submit() {
    if(this.newDialog) {
    if (!this.dialogForm.valid) {
      return;
    } else {
    let respose = this.userService.updateProduct(this.dialogForm.getRawValue());
    respose.subscribe(data=>{
      if(data == "1"){
        this.dialog.closeAll();
        this.snackBar.open('Product updated successfully!. Please Refresh', 'Close');
        window.location.reload();
      }else{
        this.snackBar.open('Product updation failed!', 'Close');
      }
    })
  }
   
  } else {
    if (!this.productForm.valid) {
      return;
    }else{
     let response = this.userService.addProduct(this.productForm.getRawValue());
     response.subscribe((data)=>{
     if(data == "0"){
       this.snackBar.open('Product insertion failed!', 'Close');
     }else {
      this.snackBar.open('Product inserted successfully!', 'Close');
      window.location.reload();
     }
     });
    }
  }
  }
}

