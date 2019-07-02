import { Component, OnInit, Inject } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {


  qsn: any = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private formBuilder: FormBuilder, private service: ApiService, public dialogRef: MatDialogRef<UserDetailsComponent>) { }


  ngOnInit() {

    // this.displayFormat(this.data);

    // this.service.getLocalData('surveyQuestions').subscribe((result: any) => {
    this.service.getInputs("/feedback/viewQuestions").subscribe((result: any) => {
      console.log(result);
      // this.qsn = result;
      for (let index = 0; index < result.data.length; index++) {
        for (let j = 0; j < result.data[index].questions.length; j++) {
          this.qsn.push({ "controlName": result.data[index].questions[j].controlName, "question": result.data[index].questions[j].ques })

        }

      }
    })

  }

  display: any = {
    accordian: {}
  };
  rating = { 0: 'Strongly Disagree', 1: 'Disagree', 2: 'Neither Agree nor Disagree', 3: 'Agree', 4: 'Strongly Agree' };

  // displayFormat(data) {

  //   this.display.accordian;

  //   for (var key in data) {
  //     if (data.hasOwnProperty(key)) {
  //       if (data[key].overAll !== 'NA') {

  //         this.display.accordian[key] = data[key];
  //         console.log(this.display.accordian);
  //       }

  //     }
  //   }
  // }

  printReport(id) {
    console.log(id)
    let printContents, popupWin;
    printContents = document.getElementById(id).innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
        <html>
          <head>
            <title>Print tab</title>
            <style>
            button{
              border:none;
              font-size:16px;
              font-width:bold;
              background:#ccc;
            }
            tr{
              margin:20px;
            }
            td{
              margin:20px;
            }
            </style>
          </head>
      <body onload="window.print();window.close()">${printContents}</body>
        </html>`
    );
    popupWin.document.close();

  }

  checkNumberOrString(type) {
    type = +type;
    if (isNaN(type)) {
      console.log(type)
      return this.rating[type]
    } else {
      return type
    }
  }








}
