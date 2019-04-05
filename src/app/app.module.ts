import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FeedbackComponent } from './feedback/feedback.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { SurveyComponent } from './survey/survey.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule, MatBadgeModule, MatSelectModule, MatInputModule, MatMenuModule, MatExpansionModule, MatChipsModule, MatButtonToggleModule, DateAdapter } from '@angular/material';
import { LoginComponent } from './login/login.component';
import { NgxMatDrpModule } from 'ngx-mat-daterange-picker';
import { MatDatepickerModule, MatDatepicker } from '@angular/material/datepicker';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LoaderComponent } from './loader/loader.component';
import { LoaderInterceptorService } from './loader-interceptor.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InboxComponent } from './inbox/inbox.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { MailComponent } from './mail/mail.component';
import { SettingsComponent } from './settings/settings.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ThankyouComponent } from './thankyou/thankyou.component';

@NgModule({
  declarations: [
    AppComponent,
    FeedbackComponent,
    SurveyComponent,
    LoginComponent,
    LoginModalComponent,
    UserDetailsComponent,
    LoaderComponent,
    DashboardComponent,
    InboxComponent,
    MailComponent,
    SettingsComponent,
    ThankyouComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatRadioModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatDialogModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    ChartModule,
    MatChipsModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    NgxMatDrpModule
  ],
  providers: [MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }],
  entryComponents: [
    LoginModalComponent,
    UserDetailsComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

