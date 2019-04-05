import { Component, OnInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { LoaderService } from '../loader.service';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})


export class SettingsComponent implements OnInit {


  feedbackForm: any = {};

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  emails: any = [];


  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder, private displayUser: LoaderService, private service: ApiService, private router: Router) { }


  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      oldPassword: ['', Validators.required],
      rePassword: ['', Validators.required]
    })

    this.emails = localStorage.emails.split(',')

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our email
    if ((value || '').trim()) {
      this.emails.push(value.trim());
      this.addMoreEmails(value.trim(), true)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  remove(email: any): void {
    const index = this.emails.indexOf(email);

    if (index >= 0) {
      this.emails.splice(index, 1);
      this.addMoreEmails(email, false)
    }
  }

  changePassword() {
    console.log(this.feedbackForm.value);
    this.service.postInputs('/feedback/changePassword', this.feedbackForm['value']).subscribe(result => {
      console.log(result);
      if (result) {
        console.log(result);
        this.snackBar.open("Successfully Updated", "Success!!!", {
          duration: 3000,
        });
        this.feedbackForm.reset();
      }


    }, error => {
      console.log(error)
    })
  }

  addMoreEmails(email, isPush) {
    let params = {};
    params['email'] = email
    params['username'] = localStorage.User;
    params['isPush'] = isPush;
    this.service.postInputs('/feedback/addMoreEmails', params).subscribe(result => {
      console.log(result);
      if (result.data.emails) {
        console.log(result);
        localStorage.setItem('emails', result.data.emails)
        this.snackBar.open("Mail Added Successfully", "Success!!!", {
          duration: 3000,
        });
        this.feedbackForm.reset();
      }


    }, error => {
      console.log(error)
    })
  }

}
