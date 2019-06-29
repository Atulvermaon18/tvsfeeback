import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

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

  questions = []
  questionsField = []
  questionType:any=''
  readQuestions = []

  questionForm: any = {};

  constructor(private formBuilder: FormBuilder, private serviceAPI: ApiService) { }

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      it_Question1: ['', Validators.required],
      it_Question2: ['', Validators.required],
      it_Question3: ['', Validators.required],
      it_Question4: ['', Validators.required],
      it_Question5: ['', Validators.required],
      it_Question6: ['', Validators.required],
      it_Question7: ['', Validators.required],
      it_Question8: ['', Validators.required],
      it_Question9: ['', Validators.required],

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
      travel_Question7: ['', Validators.required],
      travel_Question8: ['', Validators.required],
      travel_Question9: ['', Validators.required],
    })
  }

  applyFilter(filterValue: string) {
    this.questions = []
    this.questionType = filterValue;
    switch (filterValue) {
      case 'it':
        this.questionsField = [{
          "fieldName": "IT Department",
          "fieldType": 22,
          "key": "it_Question"
        }]
        break
      case 'hr':
        this.questionsField = [{
          "fieldName": "HR Department",
          "fieldType": 22,
          "key": "hr_Question"
        }]
        break
      case 'cafe':
        this.questionsField = [{
          "fieldName": "Cafeteria",
          "fieldType": 22,
          "key": "cafe_Question"
        }]
        break
      case 'office':
        this.questionsField = [{
          "fieldName": "Office Environment",
          "fieldType": 22,
          "key": "office_Question"
        }]
        break
      case 'meeting':
        this.questionsField = [{
          "fieldName": "Meeting Rooms",
          "fieldType": 22,
          "key": "meeting_Question"
        }]
        break
      case 'travel':
        this.questionsField = [{
          "fieldName": "Travel Desk",
          "fieldType": 22,
          "key": "travel_Question"
        }]
        break
    }
    this.readQuestion()
  }

  addQuestion() {
    this.questions.push({});
  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === "" || obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }

  saveQuestion(formGroup) {
    if(this.questions.length) {
      return this.updateQuestion(formGroup)
    }
    
    let params = {}
    params = formGroup['value']
    params['type'] = this.questionType
    this.clean(params);
    console.log(params)
    this.serviceAPI.postInputs('/tvsfeedback/addQuestions', params).subscribe((result: any) => {
      if(result.status === 200) {
        alert("Question(s) Successfully added")
        this.questions = []
        this.questionType = ""
        
      }
    })
  }

  updateQuestion(formGroup) {
    this.clean(formGroup['value']);
    this.serviceAPI.patchInputs('/tvsfeedback/updateQuestions?type='+ this.questionType +'&id='+this.readQuestions['_id'], formGroup['value']).subscribe((result: any) => {
      if(result.status === 200) {
        alert('Questions updated successfully')
        this.questions = []
        this.questionType = ""
      }
    })
  }

  readQuestion() {
    if(this.questionType==""){ return } 

    this.serviceAPI.getInputs('/tvsfeedback/viewQuestions?type='+ this.questionType).subscribe((result: any) => {
      if(result.status === 200) {
        this.readQuestions = result.data[0]
        this.questionForm.patchValue(this.readQuestions);
        
        if(this.readQuestions) {
          for(let key in this.readQuestions){
            console.log(key);
            if(key.indexOf(this.questionType)!==-1){
              this.questions.push(this.readQuestions[key]);
              //this.questionForm.controls[key].disable();
            }
          }
          console.log(this.questions);
        }
      }
    })

  }

}
