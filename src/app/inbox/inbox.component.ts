import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../api.service';
import { UserDetailsComponent } from './../user-details/user-details.component';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.css']
})
export class InboxComponent implements OnInit {

  tableData: any = {};
  dataSource;
  columnsToDisplay = [];

  displayedColumns = ['Employee Name', 'Feedback On', 'Employee ID', 'submit date'];
  feedbackForm = {};
  feedback: any = {
    fromdate: "",
    enddate: ""
  }
  departments = [{
    'value': 'it',
    'viewValue': "IT Department"
  },
  {
    'value': 'hr',
    'viewValue': "HR Department"
  },
  {
    'value': 'cafe',
    'viewValue': "Cafeteria"
  },
  {
    'value': 'office',
    'viewValue': "Office Environment"
  },
  {
    'value': 'meeting',
    'viewValue': "Meeting Rooms"
  },
  {
    'value': 'travel',
    'viewValue': "Travel Desk"
  }]

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private service: ApiService, private formBuilder: FormBuilder, public dialog: MatDialog, private router: Router) {
    if (!localStorage.token) {
      this.router.navigate(['/Login']);
    }
  }



  ngOnInit() {

    this.feedbackForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required]
    });


    this.service.getInputs('/feedback/ITRead').subscribe((result: any) => {

      this.tableData = this.calculateOverAll(result.data);
      this.dataSource = new MatTableDataSource<any>(this.tableData);
      this.dataSource.paginator = this.paginator;
      // this.dataSource.sort = this.sort;
      for (let i = 0; i < this.displayedColumns.length; i++) {
        this.columnsToDisplay.push({ "label": this.displayedColumns[i], "isChecked": true })
      }
    })

  }



  calculateOverAll(data) {

    for (let i = 0; i < data.length; i++) {
      data[i]['submit date'] = data[i].time;
      data[i].time = new Date(data[i].time).toDateString();
      data[i]['Employee Name'] = data[i].fb_name
      data[i]['Employee ID'] = data[i].fb_empID;
      data[i]['Feedback On'] = Object.keys(data[i])[2].substr(0, Object.keys(data[i])[2].indexOf('_'));
    }

    return data;
  }

  roudnOff(numb, type) {
    if (type == 'room number') {
      return numb
    } else {
      return (+numb).toFixed(2);
    }

  }

  applyFilter(filterValue: string) {
    console.log(filterValue)
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onDateFrom(event) {
    this.dataSource.filter = this.feedback['fromdate'].toDateString().substr(0, 10)
  }

  selectedData: any = {};

  print(id): void {
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

  onChangeCategory(event, col) {
    if (col.isChecked) {
      this.displayedColumns.push(col.label);
    } else {
      this.displayedColumns.indexOf(col.label)
      this.displayedColumns.splice(this.displayedColumns.indexOf(col.label), 1);
    }
    event.stopPropagation();
  }


  count = 0;
  reqType = ['frontOffice', 'room', 'resturant', 'bar', 'inroom', 'spa', 'pool', 'gym', 'travel'];
  openLogin(details, type): void {
    this.getDetailedFeedback(details);
  }

  getDetailedFeedback(details) {


    const dialogRef = this.dialog.open(UserDetailsComponent, {
      width: '950px',
      height: '500px',
      data: details
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
    });

  }





}


