import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { LoaderService } from './../loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {


  show = false;

  private subscription: Subscription;

  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.subscription = this.loaderService.loaderState
      .subscribe((state: any) => {
        this.show = state.show;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
