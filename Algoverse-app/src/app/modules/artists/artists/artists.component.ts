import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-artists',
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.scss']
})
export class ArtistsComponent implements OnInit {
  public hotDropDown = ['1 Day', '7 Days', '30 Days', 'All Time',];
  public isLoaded:boolean = false;

  constructor() { }

  ngOnInit(): void {
    setTimeout( () => {
      this.isLoaded = true;
    },1000)
  }

}
