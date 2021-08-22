import { UserService } from './../services/user.service';
import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.css']
})
export class AlertDialogComponent {

  id:number;

  constructor(@Inject(MAT_DIALOG_DATA) private data: any,public dialogRef: MatDialogRef<AlertDialogComponent>, private userService:UserService, public snackBar: MatSnackBar) {
    this.id = data.id;
   }

  onConfirmClick(){
    // let respose = this.userService.deleteData(this.id);
    // respose.subscribe(data=>{
    //   if(data == "1"){
    //     this.snackBar.open('User data delete successfully. Please Refresh', 'Close');
    //   }else{
    //     this.snackBar.open('User data delete failed', 'Close');
    //   }
    // })
  }

}
