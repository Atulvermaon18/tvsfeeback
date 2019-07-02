import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  questions = []
  questionsField = []
  questionType: any = ''
  readQuestions = []
  topic = [];
  questionForm: any = {};

  constructor(private formBuilder: FormBuilder, private serviceAPI: ApiService) { }

  ngOnInit() {
    this.questionForm = this.formBuilder.group({
      topic0: ['', Validators.required],
      topic1: ['', Validators.required],
      topic2: ['', Validators.required],
      question0: ['', Validators.required],
      question1: ['', Validators.required],
      question2: ['', Validators.required],
      question3: ['', Validators.required],
      question4: ['', Validators.required],
      question5: ['', Validators.required],
      question6: ['', Validators.required],
      question7: ['', Validators.required],
      question8: ['', Validators.required],
      question9: ['', Validators.required],
      question10: ['', Validators.required],
      question11: ['', Validators.required],
      question12: ['', Validators.required],
      question13: ['', Validators.required],
      question14: ['', Validators.required],
      question15: ['', Validators.required],
      question16: ['', Validators.required],
      question17: ['', Validators.required],
      question18: ['', Validators.required],
      question19: ['', Validators.required]
    })

    this.readQuestion()
  }

  addQuestion() {
    this.questions.push({});
  }

  addTopic() {
    this.topic.push({});
  }

  clean(obj) {
    for (var propName in obj) {
      if (obj[propName] === "" || obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
  }

  saveQuestion(formGroup) {

    if (this.readQuestions) {
      return this.updateQuestion(formGroup)
    }

    let params = {}
    params = formGroup['value']
    this.clean(params);
    console.log(params)
    this.serviceAPI.postInputs('/feedback/addQuestions', params).subscribe((result: any) => {
      if (result.status === 200) {
        alert("Question(s) Successfully added")
        this.questions = []
        this.questionType = ""

      }
    })
  }

  updateQuestion(formGroup) {

    this.clean(formGroup['value']);
    this.serviceAPI.patchInputs('/feedback/updateQuestions?id=' + this.readQuestions['_id'], formGroup['value']).subscribe((result: any) => {
      if (result.status === 200) {
        alert('Questions updated successfully')
        this.questions = []
        this.questionType = ""
      }
    })
  }

  readQuestion() {
    this.serviceAPI.getInputs('/feedback/viewQuestions' + this.questionType).subscribe((result: any) => {
      if (result.status === 200) {
        this.readQuestions = result.data[result.data.length - 1];

        if (this.readQuestions) {
          this.questionForm.patchValue(this.readQuestions);;
          for (let key in this.readQuestions) {
            console.log(key);
            if (key.indexOf('Question') !== -1) {
              this.questions.push(key)
            }

          }
          console.log(this.questions);
        }
      }
    })

  }

}
