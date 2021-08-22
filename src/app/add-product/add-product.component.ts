import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  productItems: FormArray;
  alphaNumericRegx = /^[\w]+([-_\s]{1}[a-z0-9]+)*$/i
  alphaRegx = /^[\w]+([-_\s]{1}[a-z]+)*$/i

  constructor(private formBuilder: FormBuilder, private userService : UserService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.productForm = new FormGroup({
      productName: new FormControl('', []),
      productItems: new FormArray([])
    });
    this.addItem();
  }

  addItem(): void {
    this.productItems = this.productForm.get('productItems') as FormArray;
    this.productItems.push(this.createItem());
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      size: '',
      price: ''
    });
  }

  deleteItem(i: any): void {
    this.productItems = this.productForm.get('productItems') as FormArray;
    this.productItems.removeAt(i);
  }

  submit() {
    if (!this.productForm.valid) {
      return;
    }else{
     let response = this.userService.addProduct(this.productForm.getRawValue());
     response.subscribe((data)=>{
     if(data == "0"){
       this.snackBar.open('Product insertion failed!', 'Close');
     }else {
      window.location.reload(); 
       this.snackBar.open('Product inserted successfully!', 'Close');
     }
     });
    }
  }

}
