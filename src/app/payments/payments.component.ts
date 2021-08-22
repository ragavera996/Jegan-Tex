import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserTable } from 'src/userTable';
import { User } from '../add-bill/add-bill.component';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  filteredOptions: Observable<User[]>;
  displayedColumns = ['bill_count', 'company_name', 'balance_amount', 'status'];

  @ViewChild(MatSort) sort:MatSort;

  dataSource : MatTableDataSource<UserTable>;

  constructor(private userService:UserService, private router: Router) { }
  

  ngOnInit()  {
    this.dataSource = new MatTableDataSource();
    let res = this.userService.getPaymentData();
        res.subscribe(
              list=>{
                this.dataSource = new MatTableDataSource(list);
                this.dataSource.sort = this.sort;
              });
}

navigate(customerId: number) {
  this.router.navigate( ['paymentHistory'], { queryParams: { customerId: customerId}});
}

ngAfterViewInit() {
  this.dataSource.sort = this.sort;
}

applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}
}
