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
  userList: any = [];
  emails: any = [];
  excludedMail: any = []


  constructor(private snackBar: MatSnackBar, private formBuilder: FormBuilder, private displayUser: LoaderService, private service: ApiService, private router: Router) { }


  ngOnInit() {
    this.feedbackForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      oldPassword: ['', Validators.required],
      rePassword: ['', Validators.required]
    })

    this.emails = localStorage.emails.split(',');
    this.userList = localStorage.employees.split(',');
    this.service.getInputs('/feedback/ITRead').subscribe((result: any) => {

      for (let i = 0; i < result.data.length; i++) {
        this.excludedMail.push(result.data[i].fb_mail)
        if (this.userList.indexOf(result.data[i].fb_mail) !== -1) {
          this.userList.splice(i, 1)
        }
      }
      console.log(this.userList, this.excludedMail)
    })

  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our email
    if ((value || '').trim()) {
      this.emails.push(value.trim());
      this.addMoreEmails(value.trim(), true, false)
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
      this.addMoreEmails(email, false, false)
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

  sendInvite() {
    let params = {};
    params['fb_mail'] = this.userList;
    params['message'] = 'Gentle reminder! Kindly finish up you feedback ASAP. '
    this.service.postInputs('/feedback/inviteMail', params).subscribe(result => {
      console.log(result);
      if (result) {
        console.log(result);
        this.snackBar.open("Mail  Sent", "Success!!!", {
          duration: 3000,
        });
      }
      this.feedbackForm.reset();
    }, error => {
      console.log(error)
    })
  }

  addInvites(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our email
    if ((value || '').trim()) {
      this.userList.push(value.trim());
      this.addMoreEmails(value.trim(), true, true)
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }


  removeInvites(email: any): void {
    const index = this.userList.indexOf(email);

    if (index >= 0) {
      this.userList.splice(index, 1);
      this.addMoreEmails(email, false, true)
    }
  }

  addMoreEmails(email, isPush, isParticipants) {
    let params = {};
    params['email'] = email
    params['username'] = localStorage.User;
    params['isPush'] = isPush;
    params['isParticipants'] = isParticipants;
    this.service.postInputs('/feedback/addMoreEmails', params).subscribe(result => {
      console.log(result);
      if (result.data.emails) {
        console.log(result);
        localStorage.setItem('emails', result.data.emails)
        this.snackBar.open("Mail Successfully Updated", "Success!!!", {
          duration: 3000,
        });
        this.feedbackForm.reset();
      }


    }, error => {
      console.log(error)
    })
  }

}
