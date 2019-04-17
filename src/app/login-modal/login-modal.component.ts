import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ApiService } from '../api.service';
import { LoaderService } from '../loader.service';

@Component({
  selector: 'app-login-modal',
  templateUrl: './login-modal.component.html',
  styleUrls: ['./login-modal.component.css']
})
export class LoginModalComponent implements OnInit {


  feedbackForm: any = {};

  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder, private displayUser: LoaderService, private service: ApiService, private router: Router, public dialogRef: MatDialogRef<LoginModalComponent>) { }


  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })


  }
  errors: any = "";

  submit() {
    console.log(this.feedbackForm['value'])
    this.service.loginInputs('/feedback/authenticate', this.feedbackForm['value']).subscribe(result => {
      console.log(result);
      if (result) {
        localStorage.setItem('User', result.firstName)
        localStorage.setItem('token', result.token);
        localStorage.setItem('emails', result.emails);
        this.displayUser.display()
        this.dialogRef.close(result.token);

      }

    }, error => {
      this.errors = error.error;
    })

  }

  forgotPwdScreen = false;
  forgotPwd(check) {
    this.forgotPwdScreen = check;
    if (check) {
      this.feedbackForm.get('password').disable();
    } else {
      this.feedbackForm.get('password').enable();
    }

  }

  sendPassword() {

    if (!this.feedbackForm.value.username) return;

    this.service.postInputs('/feedback/sendPassword', this.feedbackForm['value']).subscribe(result => {
      console.log(result);
      if (result) {
        this.snackBar.open(this.feedbackForm['value'].username + ", Your Password is send to your registered mail ID", "Success!!!", {
          duration: 5000,
        });
        this.forgotPwdScreen = false;
        this.feedbackForm.get('password').enable();
      }

    }, error => {
      this.errors = error.error;
    })
  }
}
