import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../api.service';
import { UserDetailsComponent } from './../user-details/user-details.component';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.css']
})
export class MailComponent implements OnInit {


  userFeedBack: any = {
    hotel: [],
    conference: []
  };
  displayInfo: any = {};
  constructor(private snackBar: MatSnackBar, private service: ApiService, private formBuilder: FormBuilder, public dialog: MatDialog, private router: Router) {
    if (!localStorage.token) {
      this.router.navigate(['/Login']);
    }
  }

  feedbackForm: any = {};
  ngOnInit() {

    this.feedbackForm = this.formBuilder.group({
      message: ['', Validators.required],
    });

    this.service.getInputs('/feedback/ITRead').subscribe((result: any) => {
      this.userFeedBack.hotel = result.data;
      this.displayInfo = this.userFeedBack.hotel[0];
    })


  }

  mailBack(info) {
    let params = {};
    params = info;
    params['message'] = this.feedbackForm.value.message
    this.service.postInputs('/feedback/revertMail', info).subscribe(result => {
      console.log(result);
      if (result) {
        console.log(result);
        this.snackBar.open("Mail Added Successfully", "Success!!!", {
          duration: 3000,
        });
      }
      this.feedbackForm.reset();
    }, error => {
      console.log(error)
    })
  }

  showMoreInfo(i) {
    this.displayInfo = this.userFeedBack.hotel[i];
  }


}
