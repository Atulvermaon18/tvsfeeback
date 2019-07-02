import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginModalComponent } from './../login-modal/login-modal.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  feedbackItem = [{
    "name": "New Joiners",
    "id": "newJoining",
    "icon": "important_devices",
    "isEnabled": true,
    "background": '/assets/img/newjoine.jpg',
  }, {
    "name": "IT Department",
    "id": "it",
    "icon": "important_devices",
    "isEnabled": false,
    "background": '/assets/img/it.png',
  },
  {
    "name": "HR Department",
    "id": "hr",
    "icon": "assignment_ind",
    "isEnabled": false,
    "background": '/assets/img/hr.png',
  },
  {
    "name": "Office Environment",
    "id": "office",
    "icon": "local_florist",
    "isEnabled": false,
    "background": '/assets/img/env.jpeg',
  }]

  constructor(private service: ApiService, private router: Router, public dialog: MatDialog) { }

  ngOnInit() {
  }



  selectQuest(quesType) {
    this.service.questionType = quesType;
    this.router.navigate(['/Feedback']);
  }

}
