import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FeedbackComponent } from './feedback/feedback.component';
import { SurveyComponent } from './survey/survey.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InboxComponent } from './inbox/inbox.component';
import { MailComponent } from './mail/mail.component';
import { SettingsComponent } from './settings/settings.component';
import { ThankyouComponent } from './thankyou/thankyou.component';

const routes: Routes = [
  {
    path: '', redirectTo: '/Login', pathMatch: 'full',
  },
  {
    path: 'Login', component: LoginComponent
  },
  {
    path: 'Feedback', component: FeedbackComponent
  },
  {
    path: 'ThankYou', component: ThankyouComponent
  },
  {
    path: 'SurveyResult', component: SurveyComponent,
    children: [
      { path: '', redirectTo: 'Dashboard', pathMatch: 'full' },
      { path: 'Dashboard', component: DashboardComponent },
      { path: 'Inbox', component: InboxComponent },
      { path: 'Mail', component: MailComponent },
      { path: 'Settings', component: SettingsComponent }
    ]
  }]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
