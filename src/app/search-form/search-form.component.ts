
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from '../services/user.service';
import { UserTable } from '../../userTable';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AlertDialogComponent } from '../alert-dialog/alert-dialog.component';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';
import { Observable } from 'rxjs';
import { User } from '../add-bill/add-bill.component';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css']
})
export class SearchFormComponent implements OnInit {
  filteredOptions: Observable<User[]>;

  userOptions = [];
  searchForm: FormGroup;
  billItems: FormArray;
  myControl = new FormControl();
  customer_list: any;
  displayedColumns = ['customerId', 'company_name', 'phone', 'address', 'actions'];

  @ViewChild(MatSort) sort:MatSort;

  listData : MatTableDataSource<UserTable>;

  constructor(private formBuilder: FormBuilder,private userService:UserService,private dialog: MatDialog) { }
  

  ngOnInit()  {
     this.searchForm = this.formBuilder.group({
      myControl: new FormControl('', []),
      autoComplete: new FormControl('', [])
     });
    this.listData = new MatTableDataSource();
    this.loadData();
}

loadData(){
  let res = this.userService.getFilteredUser(this.searchForm.value);
  res.subscribe(
    list=>{
      this.listData = new MatTableDataSource(list);
      this.listData.sort = this.sort;
    });
}

   openEditDialog(customerId, company_name, phone, address){
    this.dialog.open(DialogFormComponent,{
      data:{
        id: customerId,
        name: company_name,
        phone: phone,
        address: address
      }
    });
  }
}
