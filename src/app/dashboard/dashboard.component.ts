import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ApiService } from '../api.service';
import { NgxDrpOptions, PresetItem, Range } from 'ngx-mat-daterange-picker';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  range: Range = { fromDate: new Date(), toDate: new Date() };
  reqRange: any = {
    fromDate1: '', toDate1: '',
    fromDate2: '', toDate2: ''
  }
  options1: NgxDrpOptions;
  options2: NgxDrpOptions;
  presets: Array<PresetItem> = [];
  @ViewChild('dateRangePicker') dateRangePicker;
  public lineGraph: any = {
    hotel: [],
    conf: []
  };
  feedback: any = {
    empFeedback: 0,
  }
  state = {};
  bar: any = new Chart();
  useDateRange: boolean = false;
  months: any = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  year: any = [
    "2019"
  ];
  pieHotelChart = {
    Excellent: 0,
    Good: 0,
    Fair: 0,
    Poor: 0
  }
  pieConfChart = {
    Excellent: 0,
    Good: 0,
    Fair: 0,
    Poor: 0
  }
  overAllRating = [];
  overAllRatingObj: any = {
    it: [],
    hr: [],
  }
  selectedFilter: any = {
    month1: "",
    month2: "",
    year1: "",
    year2: ""
  };
  compareMonths: any = {};
  compareYear: any = {};
  graphcategories = {
    year: ["2019"],
    month: ["Mar"]
  }

  monthlyGraphStructure = [];

  constructor(private service: ApiService, private formBuilder: FormBuilder, public dialog: MatDialog, private router: Router) {
    if (!localStorage.token) {
      this.router.navigate(['/Login']);
    }
  }


  ngOnInit() {

    this.compareMonths = this.formBuilder.group({
      month1: ['', Validators.required],
      month2: ['', Validators.required]
    })

    var makeDate = new Date();
    let prevMonth = makeDate.setMonth(makeDate.getMonth() - 1)
    this.compareMonths.patchValue({
      month1: new Date(prevMonth),
      month2: new Date()
    })

    const today = new Date();
    const fromMin = new Date(today.getFullYear(), today.getMonth() - 2, 1);
    const fromMax = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const toMin = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const toMax = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    this.setupPresets();
    this.options1 = {
      presets: this.presets,
      format: 'mediumDate',
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit",
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false
      },
      // cancelLabel: "Cancel",
      // excludeWeekends:true,
      fromMinMax: { fromDate: fromMin, toDate: fromMax },
      toMinMax: { fromDate: toMin, toDate: toMax }
    };
    this.options2 = {
      presets: this.presets,
      format: 'mediumDate',
      range: { fromDate: today, toDate: today },
      applyLabel: "Submit",
      calendarOverlayConfig: {
        shouldCloseOnBackdropClick: false
      },
      // cancelLabel: "Cancel",
      // excludeWeekends:true,
      // fromMinMax: { fromDate: fromMin, toDate: fromMax },
      // toMinMax: { fromDate: toMin, toDate: toMax }
    };

    this.doCompareMonth();


  }


  // handler function that receives the updated date range object
  updateRangeStart(range: Range) {
    this.range = range;
    this.reqRange.fromDate1 = this.range.fromDate;
    this.reqRange.toDate1 = this.range.toDate,
      console.log(this.range);
  }
  updateRangeEnd(range: Range) {
    this.range = range;
    this.reqRange.fromDate2 = this.range.fromDate;;
    this.reqRange.toDate2 = this.range.toDate;
    console.log(this.range);
  }

  // helper function to create initial presets
  setupPresets() {

    const backDate = (numOfDays) => {
      const today = new Date();
      return new Date(today.setDate(today.getDate() - numOfDays));
    }

    const today = new Date();
    const yesterday = backDate(1);
    const minus7 = backDate(7)
    const minus30 = backDate(30);
    const currMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const currMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    this.presets = [
      { presetLabel: "Yesterday", range: { fromDate: yesterday, toDate: today } },
      { presetLabel: "Last 7 Days", range: { fromDate: minus7, toDate: today } },
      { presetLabel: "Last 30 Days", range: { fromDate: minus30, toDate: today } },
      { presetLabel: "This Month", range: { fromDate: currMonthStart, toDate: currMonthEnd } },
      { presetLabel: "Last Month", range: { fromDate: lastMonthStart, toDate: lastMonthEnd } }
    ]
  }


  dateRangeHandler() {
    console.log(this.useDateRange)
    this.useDateRange = !this.useDateRange;
  }



  doCompareMonth() {
    this.graphcategories.month = [];
    this.graphcategories.month.push(this.months[this.compareMonths.value.month1.getMonth()])
    this.graphcategories.month.push(this.months[this.compareMonths.value.month2.getMonth()]);
    if (this.useDateRange) {
      this.doDateFilter(this.range);
    } else {
      this.doFilter(this.compareMonths.value, 'month');
    }

  }

  doDateFilter(params) {

    this.service.postInputs('/feedback/dateFilter', params).subscribe((result: any) => {

    })
  }

  doFilter(req, by) {
    // return
    req.type = by;
    this.service.getInputs('/feedback/ITRead').subscribe((result: any) => {
      this.feedback.empFeedback = result.data.length;
      this.overAllRatingObj = {
        it: [],
        hr: []
      }
      if (result.data.length) {
        this.barChartCalculation(result.data);
      } else {
        this.setZeroForMonths();
      }
    })
  }

  setZeroForMonths() {
    this.overAllRatingObj.it.push(0);
    this.overAllRatingObj.hr.push(0);
  }


  barChartCalculation(data) {

    let overAllRating = [];
    for (let i = 0; i < data.length; i++) {
      Object.keys(data[i]).forEach(function (type) {
        console.log()
        let dept = type.substr(0, type.indexOf('_'))
        switch (dept) {
          case 'it':
            if (!isNaN(+data[i][type])) {
              if (!overAllRating[dept]) {
                overAllRating[dept] = 0;
              }
              overAllRating[dept] = overAllRating[dept] + +data[i][type];
            }
            break;

          case 'hr':
            if (!isNaN(+data[i][type])) {
              if (!overAllRating[dept]) {
                overAllRating[dept] = 0;
              }
              overAllRating[dept] = overAllRating[dept] + +data[i][type];
            }
            break;
        }

      })

    }

    console.log(overAllRating, data.length);
    this.overAllRatingObj['it'].push(overAllRating['it']);
    this.overAllRatingObj['hr'].push(overAllRating['hr']);
    this.structureMonthlyGraphs();


  }



  structureMonthlyGraphs() {



    this.bar = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Monthly Average Rating'
      },
      subtitle: {
        text: 'Source: Smart Survey'
      },
      xAxis: {
        categories: ['Apr'],
        crosshair: true
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Rating (4)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} </b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'IT',
        data: this.overAllRatingObj.it

      }, {
        name: 'HR',
        data: this.overAllRatingObj.hr

      },
      {
        name: 'Cafe',
        data: [55]

      }, {
        name: 'Meeting Room Avaliblity',
        data: [34]

      }, {
        name: 'Office Environment',
        data: [84]

      },

      {
        name: 'Travel For Ladies',
        data: [50]

      }]
    });
  }











}
