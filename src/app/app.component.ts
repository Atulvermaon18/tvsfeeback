import { Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { FormBuilder, Validators } from '@angular/forms';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { LoaderService } from './loader.service';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {


  feedbackForm: any = {};
  user: any = "";
  subscription: Subscription;
  constructor(public router: Router, public dialog: MatDialog, private loaderService: LoaderService) {
    this.user = localStorage.User;
  }


  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state) => {
        this.user = localStorage.User
      });
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(LoginModalComponent, {
      width: '450px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result)
      if (result) {
        this.router.navigate(['/SurveyResult']);
      }


    });
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/Login']);
  }
}
