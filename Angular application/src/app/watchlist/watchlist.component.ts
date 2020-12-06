import { Component, OnInit } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../api.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit {

  constructor(private router: Router, private api: ApiService) { }


  isLoading = true;
  timerNotFav;
  alertTypeNotFav;

  favList: any
  watchList: any = []

  clickWatch(value){
      this.router.navigate(['/details/'+ value.ticker]);
  }

  notFav(watch){
      this.watchList.splice(this.watchList.indexOf(watch), 1);
      this.favList.splice(this.favList.indexOf(watch.ticker+"+"+watch.name), 1);
      localStorage.setItem("favList", JSON.stringify(this.favList));
      this.ngOnInit();
  }

  ngOnInit(): void {

      this.favList = JSON.parse(localStorage.getItem("favList"));

      if(this.favList == null || this.favList.length == 0) {
          this.favList = [];
          this.isLoading = false;
          return;
      }

      this.favList = this.favList.sort();

      var allIds = "";

      for(var i = 0; i < this.favList.length; i++) {
          allIds += this.favList[i].split("+")[0]+",";
      }

      var mainArr = new Map;

        this.api.getIex(allIds)
        .pipe(
          map((response: Response) => {

            for(var i = 0; i < this.favList.length; i++) {

                var newArr = new Map;

                var ticker = response[i]["ticker"];

                newArr['ticker'] = ticker;

                var last = response[i]["last"];
                var prev = response[i]["prevClose"];

                if(last - prev > 0){
                  newArr['upOrDown'] = "/assets/up.svg";
                  newArr['marketColor'] = "text-success";
                } else if(last - prev == 0){
                  newArr['upOrDown'] = "";
                  newArr['marketColor'] = "";
                } else {
                  newArr['upOrDown'] = "/assets/down.svg";
                  newArr['marketColor'] = "text-danger";
                }

                var change = (last-prev);
                var percentage = (change*100/prev);

                newArr['last'] = response[i]["last"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                newArr['change'] = change.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
                newArr['percentage'] = percentage.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

                mainArr.set(ticker, newArr);

            }

            for(var i = 0; i < this.favList.length; i++) {
                var tick = this.favList[i].split("+")[0];
                var arr = mainArr.get(tick);
                arr['name'] = this.favList[i].split("+")[1];
                this.watchList[i]=(arr);
            }

            this.isLoading = false;

          }))
          .subscribe();
      }

}
