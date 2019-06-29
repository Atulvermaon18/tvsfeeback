import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../api.service';
import { UserDetailsComponent } from './../user-details/user-details.component';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent implements OnInit {

  tableData: any = {};
  dataSource;
  columnsToDisplay = [];
  feedbackForm = {};
  feedback: any = {
    fromdate: "",
    enddate: ""
  }

  folders: any = [
    {
      name: 'Inbox',
      updated: "Closer View",
      icon: "perm_contact_calendar"
    },
    {
      name: 'Dashboard',
      updated: "Overall View",
      icon: "dashboard"
    }, {
      name: 'Mail',
      updated: 'Revert',
      icon: "mail"
    },
    {
      name: 'Questions',
      updated: 'Add',
      icon: "settings"
    },
    {
      name: 'Settings',
      updated: 'Revert',
      icon: "settings"
    }
  ];



  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  selectedData: any = {};

  constructor(private service: ApiService, private formBuilder: FormBuilder, public dialog: MatDialog, private router: Router) {
    if (!localStorage.token) {
      this.router.navigate(['/Login']);
    }
  }

  ngOnInit() {


  }





}
