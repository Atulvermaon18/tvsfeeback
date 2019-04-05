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
    totalHotelFeedback: 0,
    totalConfrenceFeedback: 0
  }
  state = {};
  pie: any = new Chart();
  pieChart: any = new Chart();
  bar: any = new Chart();
  barYear: any = new Chart();
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
  overAllRatingObj = {
    bar: [],
    frontOffice: [],
    gym: [],
    inroom: [],
    pool: [],
    resturant: [],
    room: [],
    spa: [],
    travel: []
  }
  overAllYearlyRatingObj = {
    bar: [],
    frontOffice: [],
    gym: [],
    inroom: [],
    pool: [],
    resturant: [],
    room: [],
    spa: [],
    travel: []
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
  yearlyGraphStructure = [];

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
    this.compareYear = this.formBuilder.group({
      year1: ['', Validators.required],
      year2: ['', Validators.required]
    })

    var makeDate = new Date();
    let prevMonth = makeDate.setMonth(makeDate.getMonth() - 1)
    this.compareMonths.patchValue({
      month1: new Date(prevMonth),
      month2: new Date()
    })

    this.compareYear.patchValue({
      year1: new Date(2019, 0, 1),
      year2: new Date()
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
    this.doCompareYears();

    this.service.getInputs('/feedback/confRead').subscribe((result: any) => {
      console.log(result.data);
      this.lineGraph.conf = result.data;
      this.calculateConferenceAverage(result.data)
      this.feedback.totalConfrenceFeedback = result.data.length;
      this.pieChart = new Chart({
        chart: {
          type: 'pie'
        },
        title: {
          text: 'Feedback on Conference'
        },
        credits: {
          enabled: false
        },
        series: [
          {
            name: 'Feedback',
            data: [{
              name: 'Excellent',
              y: this.pieConfChart.Excellent,
              selected: true
            }, {
              name: 'Good',
              y: this.pieConfChart.Good
            }, {
              name: 'Fair',
              y: this.pieConfChart.Fair
            }]
          }
        ]
      });
    })

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




  calculateConferenceAverage(data) {
    for (let i = 0; i < data.length; i++) {
      let overAllAverage = 0;
      let dividend = 0;
      let average = 0;
      Object.keys(data[i]).forEach(function (type) {
        if (type.indexOf('conf_') !== -1) {
          average = +data[i][type] + average;
          dividend++;
        }
      })
      overAllAverage = Math.round(average / dividend);
      switch (overAllAverage) {
        case 2:
          this.pieConfChart.Fair++
          break;
        case 3:
          this.pieConfChart.Good++
          break;
        case 4:
          this.pieConfChart.Excellent++
          break;

      }
    }

  }


  calculateOverAll(data) {

    let pieHotelChart = {
      Excellent: 0,
      Good: 0,
      Fair: 0,
      Poor: 0
    }
    this.feedback.totalHotelFeedback = data.length;
    for (let i = 0; i < data.length; i++) {
      Object.keys(data[i]).forEach(function (type) {
        if (!isNaN(data[i][type])) {
          console.log(type, +data[i][type])
          let eachUserOverAllFeedBack = Math.round(+data[i][type]);
          switch (eachUserOverAllFeedBack) {
            case 2:
              pieHotelChart['Fair']++
              break;
            case 3:
              pieHotelChart['Good']++
              break;
            case 4:
              pieHotelChart['Excellent']++
              break;

          }
        }
      });
      data[i].time = new Date(data[i].time).toDateString();
    }
    this.pieHotelChart.Excellent = pieHotelChart['Excellent'];
    this.pieHotelChart.Good = pieHotelChart['Good'];
    this.pieHotelChart.Fair = pieHotelChart['Fair'];

    console.log(this.pieHotelChart);
    this.pie = new Chart({
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Feedback on Hotel'
      },
      credits: {
        enabled: false
      },
      series: [
        {
          name: 'Feedback',
          data: [{
            name: 'Excellent',
            y: this.pieHotelChart.Excellent,
          }, {
            name: 'Good',
            y: this.pieHotelChart.Good
          }, {
            name: 'Fair',
            y: this.pieHotelChart.Fair
          }]
        }
      ]
    });

  }

  barChartCalculation(data) {
    let overAllRating = [];
    for (let i = 0; i < data.length; i++) {
      Object.keys(data[i]).forEach(function (type) {
        if (!isNaN(+data[i][type])) {
          if (!overAllRating[type]) {
            overAllRating[type] = 0;
          }
          overAllRating[type] = overAllRating[type] + +data[i][type];
        }
      })

    }

    console.log(overAllRating, data.lengt);

    for (const key in overAllRating) {
      if (overAllRating.hasOwnProperty(key)) {
        if (this.overAllRatingObj[key] && overAllRating[key]) {
          this.overAllRatingObj[key].push(((overAllRating[key] / data.length) * 100))
        }

      }
    }

    this.structureMonthlyGraphs();



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
        categories: this.graphcategories.month,
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
      series: this.monthlyGraphStructure
    });
  }


  overAllYearlyCalculation(data) {
    let overAllRating = [];
    for (let i = 0; i < data.length; i++) {
      Object.keys(data[i]).forEach(function (type) {
        if (!isNaN(+data[i][type])) {
          if (!overAllRating[type]) {
            overAllRating[type] = 0;
          }
          overAllRating[type] = overAllRating[type] + +data[i][type];
        }
      })

    }

    console.log(overAllRating, data.length);

    for (const key in overAllRating) {
      if (overAllRating.hasOwnProperty(key)) {
        if (this.overAllYearlyRatingObj[key] && overAllRating[key]) {
          this.overAllYearlyRatingObj[key].push(((overAllRating[key] / data.length) * 100));
        }
      }
    }

    this.structureYearlyGraphs();



    this.barYear = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: 'Yearly Average Rating'
      },
      subtitle: {
        text: 'Source: Smart Survey'
      },
      xAxis: {
        categories: this.graphcategories.year,
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
      series: this.yearlyGraphStructure
    });
  }



  doCompareYears() {
    this.graphcategories.year = [];
    this.graphcategories.year.push(this.compareYear.value.year1.getFullYear())
    this.graphcategories.year.push(this.compareYear.value.year2.getFullYear());
    this.doFilter(this.compareYear.value, 'year');
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
    req.type = by;
    this.service.postInputs('/feedback/filter', req).subscribe((result: any) => {
      this.calculateOverAll(result.total);
      switch (by) {
        case 'month':
          this.overAllRatingObj = {
            bar: [],
            frontOffice: [],
            gym: [],
            inroom: [],
            pool: [],
            resturant: [],
            room: [],
            spa: [],
            travel: []
          }
          if (result.data.from.length) {
            this.barChartCalculation(result.data.from);
          } else {
            this.setZeroForMonths();
          }
          if (result.data.to.length) {
            this.barChartCalculation(result.data.to);
          } else {
            this.setZeroForMonths();
          }
          console.log("months ", this.graphcategories.month)

          break;
        case 'year':
          this.overAllYearlyRatingObj = {
            bar: [],
            frontOffice: [],
            gym: [],
            inroom: [],
            pool: [],
            resturant: [],
            room: [],
            spa: [],
            travel: []
          }
          if (result.data.from.length) {
            this.overAllYearlyCalculation(result.data.from);
          } else {
            this.setZeroForYear();
          }
          if (result.data.to.length) {
            this.overAllYearlyCalculation(result.data.to);
          } else {
            this.setZeroForYear();
          }
          break;
      }
    })
  }

  setZeroForMonths() {
    this.overAllRatingObj.bar.push(0);
    this.overAllRatingObj.frontOffice.push(0);
    this.overAllRatingObj.gym.push(0);
    this.overAllRatingObj.inroom.push(0);
    this.overAllRatingObj.resturant.push(0);
    this.overAllRatingObj.room.push(0);
    this.overAllRatingObj.pool.push(0);
    this.overAllRatingObj.spa.push(0);
    this.overAllRatingObj.travel.push(0);
  }

  setZeroForYear() {
    this.overAllYearlyRatingObj.bar.push(0);
    this.overAllYearlyRatingObj.frontOffice.push(0);
    this.overAllYearlyRatingObj.gym.push(0);
    this.overAllYearlyRatingObj.inroom.push(0);
    this.overAllYearlyRatingObj.resturant.push(0);
    this.overAllYearlyRatingObj.room.push(0);
    this.overAllYearlyRatingObj.pool.push(0);
    this.overAllYearlyRatingObj.spa.push(0);
    this.overAllYearlyRatingObj.travel.push(0);
  }



  structureMonthlyGraphs() {

    this.monthlyGraphStructure = [{
      name: 'Reception',
      data: this.overAllRatingObj.frontOffice

    }, {
      name: 'Room',
      data: this.overAllRatingObj.room

    }, {
      name: 'Mosaic Restaurant',
      data: this.overAllRatingObj.resturant

    }, {
      name: 'The Terrace Bar',
      data: this.overAllRatingObj.bar

    }, {
      name: 'In-Room Dinning',
      data: this.overAllRatingObj.inroom

    }, {
      name: 'Thabiti Spa',
      data: this.overAllRatingObj.spa

    }, {
      name: 'Swimming Pool',
      data: this.overAllRatingObj.pool


    }, {
      name: 'Fitness Center',
      data: this.overAllRatingObj.gym
    },
    {
      name: 'Travel',
      data: this.overAllRatingObj.travel


    }]

    console.log(this.monthlyGraphStructure)
  }

  structureYearlyGraphs() {

    this.yearlyGraphStructure = [{
      name: 'Reception',
      data: this.overAllYearlyRatingObj.frontOffice

    }, {
      name: 'Room',
      data: this.overAllYearlyRatingObj.room

    }, {
      name: 'Mosaic Restaurant',
      data: this.overAllYearlyRatingObj.resturant

    }, {
      name: 'The Terrace Bar',
      data: this.overAllYearlyRatingObj.bar

    }, {
      name: 'In-Room Dinning',
      data: this.overAllYearlyRatingObj.inroom

    }, {
      name: 'Thabiti Spa',
      data: this.overAllYearlyRatingObj.spa

    }, {
      name: 'Swimming Pool',
      data: this.overAllYearlyRatingObj.pool

    }, {
      name: 'Fitness Center',
      data: this.overAllYearlyRatingObj.gym
    },
    {
      name: 'Travel',
      data: this.overAllYearlyRatingObj.travel


    }]
  }









}
