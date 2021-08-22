import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ProductTable } from 'src/productTable';
import { User } from '../add-bill/add-bill.component';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import { ProductUpdateDialogComponent } from '../product-update-dialog/product-update-dialog.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-manage-product',
  templateUrl: './manage-product.component.html',
  styleUrls: ['./manage-product.component.css']
})
export class ManageProductComponent implements OnInit {
  filteredOptions: Observable<User[]>;

  userOptions = [];
  productForm: FormGroup;
  billItems: FormArray;
  myControl = new FormControl();
  customer_list: any;
  displayedColumns = ['productId', 'product_name', 'size', 'price', 'actions'];

  @ViewChild(MatSort) sort:MatSort;

  productData : MatTableDataSource<ProductTable>;

  constructor(private formBuilder: FormBuilder,private userService:UserService,private dialog: MatDialog) { }
  

  ngOnInit()  {
     this.productForm = this.formBuilder.group({
      myControl: new FormControl('', []),
      autoComplete: new FormControl('', [])
     });
    this.loadData();
}

loadData(){
  let res = this.userService.getProductData(this.productForm.value);
  res.subscribe(
    list=>{
      this.productData = new MatTableDataSource(list);
      this.productData.sort = this.sort;
    });
}

   openEditDialog(id,name,size,price, psId) {
    this.dialog.open(ProductUpdateDialogComponent,{
      data:{
        id: id,
        name: name,
        size: size,
        price: price,
        psId: psId
      }
    });
  }

}
