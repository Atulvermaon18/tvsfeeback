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
  todaysDate = new Date();
  constructor(private formBuilder: FormBuilder, private service: ApiService, private router: Router) { }

  ngOnInit() {

    this.feedbackForm = this.formBuilder.group({

      // it_Question1: ['', Validators.required],
      // it_Question2: ['', Validators.required],
      // it_Question3: ['', Validators.required],
      // it_Question4: ['', Validators.required],
      // it_Question5: ['', Validators.required],
      // it_Question6: ['', Validators.required],
      // it_Question7: ['', Validators.required],
      // it_Question8: ['', Validators.required],
      // it_Question9: ['', Validators.required],
      // it_Question10: ['', Validators.required],

      // hr_Question1: ['', Validators.required],
      // hr_Question2: ['', Validators.required],
      // hr_Question3: ['', Validators.required],
      // hr_Question4: ['', Validators.required],
      // hr_Question5: ['', Validators.required],
      // hr_Question6: ['', Validators.required],
      // hr_Question7: ['', Validators.required],
      // hr_Question8: ['', Validators.required],
      // hr_Question9: ['', Validators.required],

      // cafe_Question1: ['', Validators.required],
      // cafe_Question2: ['', Validators.required],
      // cafe_Question3: ['', Validators.required],
      // cafe_Question4: ['', Validators.required],
      // cafe_Question5: ['', Validators.required],
      // cafe_Question6: ['', Validators.required],
      // cafe_Question7: ['', Validators.required],
      // cafe_Question8: ['', Validators.required],
      // cafe_Question9: ['', Validators.required],


      // office_Question1: ['', Validators.required],
      // office_Question2: ['', Validators.required],
      // office_Question3: ['', Validators.required],
      // office_Question4: ['', Validators.required],
      // office_Question5: ['', Validators.required],
      // office_Question6: ['', Validators.required],
      // office_Question7: ['', Validators.required],
      // office_Question8: ['', Validators.required],
      // office_Question9: ['', Validators.required],


      // meeting_Question1: ['', Validators.required],
      // meeting_Question2: ['', Validators.required],
      // meeting_Question3: ['', Validators.required],
      // meeting_Question4: ['', Validators.required],
      // meeting_Question5: ['', Validators.required],
      // meeting_Question6: ['', Validators.required],
      // meeting_Question7: ['', Validators.required],
      // meeting_Question8: ['', Validators.required],
      // meeting_Question9: ['', Validators.required],
      // meeting_Question10: ['', Validators.required],

      // gq_Question1: ['', Validators.required],
      // gq_Question2: ['', Validators.required],
      // gq_Question3: ['', Validators.required],
      // gq_Question4: ['', Validators.required],
      // gq_Question5: ['', Validators.required],
      // gq_Question6: ['', Validators.required],
      // gq_Question7: ['', Validators.required],
      // gq_Question8: ['', Validators.required],
      // gq_Question9: ['', Validators.required],
      // gq_Question10: ['', Validators.required],

      newjoin_Question1: ['', Validators.required],
      newjoin_Question2: ['', Validators.required],
      newjoin_Question3: ['', Validators.required],
      newjoin_Question4: ['', Validators.required],
      newjoin_Question5: ['', Validators.required],
      newjoin_Question6: ['', Validators.required],
      newjoin_Question7: ['', Validators.required],
      newjoin_Question8: ['', Validators.required],
      newjoin_Question9: ['', Validators.required],
      newjoin_Question10: ['', Validators.required],
      newjoin_Question11: ['', Validators.required],
      newjoin_Question12: ['', Validators.required],
      newjoin_Question13: ['', Validators.required],
      newjoin_Question14: ['', Validators.required],
      newjoin_Question15: ['', Validators.required],
      newjoin_Question16: ['', Validators.required],
      newjoin_Question17: ['', Validators.required],
      newjoin_Question18: ['', Validators.required],
      newjoin_Question19: ['', Validators.required],
      newjoin_Question20: ['', Validators.required],
      newjoin_Question21: ['', Validators.required],
      newjoin_Question22: ['', Validators.required],
      newjoin_Question23: ['', Validators.required],


      fb_name: ['', Validators.required],
      fb_empID: ['', Validators.required],
      fb_doj: ['', Validators.required],
      fb_dept: ['', Validators.required],
      fb_mail: ['', Validators.required],
      fb_grade: ['', Validators.required]
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
    // debugger;
    console.log(this.feedbackForm)
    // return;
    console.log(this.feedbackForm['value']);
    let params = this.feedbackForm['value'];
    this.clean(params);
    switch (this.service.questionType) {
      case 'it':
        this.service.feedbackPost('/feedback/ITCreate', this.feedbackForm['value']).subscribe(result => {
          console.log(result);
          this.router.navigate(['/ThankYou']);
        })
        break;
      case 'hr':
        this.service.feedbackPost('/feedback/HRCreate', this.feedbackForm['value']).subscribe(result => {
          console.log(result);
          this.router.navigate(['/ThankYou']);
        })
        break;
      case 'newJoining':
        this.service.feedbackPost('/feedback/NewJoining', this.feedbackForm['value']).subscribe(result => {
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
