import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  feedbackForm = {};
  questions: any = [];
  options: any = [];
  images = [];
  selectedImage = "assets/img/video.jpg";

  constructor(private formBuilder: FormBuilder, private service: ApiService, private router: Router) { }

  ngOnInit() {

    this.feedbackForm = this.formBuilder.group({

      it_Atomsphere: ['', Validators.required],
      it_cleanliness: ['', Validators.required],
      it_internetConn: ['', Validators.required],
      it_airFlow: ['', Validators.required],
      it_breakout: ['', Validators.required],
      it_foodService: ['', Validators.required],
      it_quality: ['', Validators.required],
      it_staff: ['', Validators.required],
      it_comfort: ['', Validators.required],

      hr_Question1: ['', Validators.required],
      hr_Question2: ['', Validators.required],
      hr_Question3: ['', Validators.required],
      hr_Question4: ['', Validators.required],
      hr_Question5: ['', Validators.required],
      hr_Question6: ['', Validators.required],
      hr_Question7: ['', Validators.required],
      hr_Question8: ['', Validators.required],
      hr_Question9: ['', Validators.required],

      cafe_Question1: ['', Validators.required],
      cafe_Question2: ['', Validators.required],
      cafe_Question3: ['', Validators.required],
      cafe_Question4: ['', Validators.required],
      cafe_Question5: ['', Validators.required],
      cafe_Question6: ['', Validators.required],
      cafe_Question7: ['', Validators.required],
      cafe_Question8: ['', Validators.required],
      cafe_Question9: ['', Validators.required],


      office_Question1: ['', Validators.required],
      office_Question2: ['', Validators.required],
      office_Question3: ['', Validators.required],
      office_Question4: ['', Validators.required],
      office_Question5: ['', Validators.required],
      office_Question6: ['', Validators.required],
      office_Question7: ['', Validators.required],
      office_Question8: ['', Validators.required],
      office_Question9: ['', Validators.required],


      meeting_Question1: ['', Validators.required],
      meeting_Question2: ['', Validators.required],
      meeting_Question3: ['', Validators.required],
      meeting_Question4: ['', Validators.required],
      meeting_Question5: ['', Validators.required],
      meeting_Question6: ['', Validators.required],
      meeting_Question7: ['', Validators.required],
      meeting_Question8: ['', Validators.required],
      meeting_Question9: ['', Validators.required],
      meeting_Question10: ['', Validators.required],

      travel_Question1: ['', Validators.required],
      travel_Question2: ['', Validators.required],
      travel_Question3: ['', Validators.required],
      travel_Question4: ['', Validators.required],
      travel_Question5: ['', Validators.required],
      travel_Question6: ['', Validators.required],


      fb_name: ['', Validators.required],
      fb_empID: ['', Validators.required],
      fb_mail: ['', Validators.required],
      fb_phone: ['', Validators.required],
      suggestionShare: ['', Validators.required]
    });

    this.images = [
      'assets/img/video.jpg',
      'assets/img/video.jpg',
      'assets/img/video.jpg',
      'assets/img/video.jpg',
      'assets/img/video.jpg',
      'assets/img/video.jpg',
      'assets/img/video.jpg',
      'assets/img/video.jpg',
    ];

    this.options = [
      {
        rating: 4,
        icon: "",
        label: "Excellent"
      },
      {
        rating: 3,
        icon: "",
        label: "Good"
      },
      {
        rating: 2,
        icon: "",
        label: "Fair"
      }
    ]

    this.questions = [];

    if (this.service.questionType) {

      this.service.getLocalData(this.service.questionType).subscribe((result: any) => {
        console.log(result);
        this.questions = result.data;
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

    console.log(this.feedbackForm['value']);
    let params = this.feedbackForm['value'];
    this.clean(params);
    switch (this.service.questionType) {
      case 'it':
        this.service.feedbackPost('/tvsfeedback/ITCreate', this.feedbackForm['value']).subscribe(result => {
          console.log(result);
          this.router.navigate(['/ThankYou']);
        })
        break;
      case 'hr':
        this.service.feedbackPost('/tvsfeedback/HRCreate', this.feedbackForm['value']).subscribe(result => {
          console.log(result);
          this.router.navigate(['/ThankYou']);
        })
        break;
    }

  }


  radioChange(event, forques, i) {
    console.log(this.feedbackForm['value'][forques + i]);
  }




}