import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { FormData } from './../interface/form-data';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackForm: FormGroup;

  formData: FormData[];
  questions: any = [];
  options: any = [];
  images = [];
  selectedImage = "assets/img/video.jpg";
  todaysDate = new Date();
  constructor(private formBuilder: FormBuilder, private service: ApiService, private router: Router) { }

  ngOnInit() {

    this.feedbackForm = new FormGroup({});

    const formGroup = {};

    this.options = [
      {
        rating: 4,
        icon: "",
        label: "Strongly Agree"
      },
      {
        rating: 3,
        icon: "",
        label: "Agree"
      },
      {
        rating: 2,
        icon: "",
        label: "Neither Agree nor Disagree"
      },
      {
        rating: 1,
        icon: "",
        label: "Disagree"
      },
      {
        rating: 0,
        icon: "",
        label: "Strongly Disagree"
      }
    ]

    this.questions = [];

    if (this.service.questionType) {

      this.service.getInputs("/feedback/viewQuestions").subscribe((result: any) => {
        // this.service.getLocalData("questions").subscribe((result: any) => {

        console.log(result);
        this.formData = result.data;
        this.formData.forEach((topic, i) => {
          this.formData[i]['questions'].forEach((formControl: any) => {
            formGroup[formControl.controlName] = new FormControl('');
          });
        })
        formGroup['fb_name'] = new FormControl('');
        formGroup['fb_empID'] = new FormControl('');
        formGroup['fb_doj'] = new FormControl('');
        formGroup['fb_dept'] = new FormControl('');
        formGroup['fb_mail'] = new FormControl('');
        formGroup['fb_grade'] = new FormControl('');
        this.feedbackForm = new FormGroup(formGroup);
      })

    } else {
      this.router.navigate(['/Login']);
    }


  }


  changeImage(i) {
    this.selectedImage = this.images[i];
  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === "" || obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }

  submit() {
    // debugger;
    console.log(this.feedbackForm)
    // return;
    console.log(this.feedbackForm['value']);
    let params = this.feedbackForm['value'];
    this.clean(params);

    this.service.feedbackPost('/feedback/NewJoining', this.feedbackForm['value']).subscribe(result => {
      console.log(result);
      this.router.navigate(['/ThankYou']);
    })



  }


  radioChange(event, forques, i) {
    console.log(this.feedbackForm['value'][forques + i]);
  }




}
