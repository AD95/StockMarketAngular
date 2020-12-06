import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
      $(document).ready(function () {
        $(".navbar a").click(function(event) {
          if($(".nav-item").is(":visible"))
            (<any>$(".navbar-collapse")).collapse('hide');
        });
        $(".navbar-toggler").click(function(event) {
          if($(".nav-item").is(":visible")){
            (<any>$(".navbar-collapse")).collapse('hide');
            return false;
          }
        });
      });

  }
}
