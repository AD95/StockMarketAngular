import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../api.service'
import * as Highcharts from 'highcharts/highstock';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})

export class DetailsComponent implements OnInit, OnDestroy {

  ticker;
  name;
  exchangecode;
  price;
  change;
  currentdate;
  high;
  low;
  open;
  prev;
  vol;
  mid;
  ask;
  size;
  bidprice;
  bidsize;
  desc;
  last;
  lastDisplay;
  percentage;
  isOpen;
  marketOpen;
  upOrDown;
  isFav = false;
  isFavIcon;
  buydisabled = true;
  buynumber = 0;
  startDate;
  marketColor;
  notFound;
  alertTypeFav;
  alertTypeNotFav;
  alertTypeBuy;
  finishedChart;
  finishedChart1;
  finishedNews;
  finishedDetails;
  finishedDetails1;
  total;
  totalDisplay;
  timerBuy;
  timerFav;
  timerNotFav;
  isOpenDate;
  isLoading = true;
  timer;
  updateFlag = false;
  updateFlag1 = false;
  favList: any
  buyMap: any

  newsArray: any = [];
  modalNews: any

  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options
  isHighcharts = typeof this.Highcharts === 'object';

  Highcharts1: typeof Highcharts = Highcharts;
  chartOptions1: Highcharts.Options
  isHighcharts1 = typeof this.Highcharts1 === 'object';

  chartt;
  chartt1;

  constructor(private route: ActivatedRoute, private api: ApiService) { }

  chart1(data) {

    let indicators = require('highcharts/indicators/indicators');
    indicators(this.Highcharts1);
    var vbp = require('highcharts/indicators/volume-by-price');
    vbp(this.Highcharts1);

    var ohlc = [],
        volume = [],
        dataLength = data.length,
        i = 0;

    for (i; i < dataLength; i += 1) {
        var date = new Date(data[i].date);
        var milliseconds = date.getTime();
        ohlc.push([
            milliseconds, // the date
            data[i].open, // open
            data[i].high, // high
            data[i].low, // low
            data[i].close // close
        ]);

        volume.push([
            milliseconds, // the date
            data[i].volume // the volume
        ]);
    }


    this.chartOptions1 = {

      rangeSelector: {
          selected: 2
      },
      time: {
          useUTC: false,
      },
      title: {
          text: this.ticker + ' Historical'
      },
      subtitle: {
          text: 'With SMA and Volume by Price technical indicators'
      },
      yAxis: [{
          startOnTick: false,
          endOnTick: false,
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'OHLC'
          },
          height: '60%',
          lineWidth: 2,
          resize: {
              enabled: true
          }
      }, {
          labels: {
              align: 'right',
              x: -3
          },
          title: {
              text: 'Volume'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
      }],
      tooltip: {
          split: true
      },
      series: [{
          type: 'candlestick',
          name: this.ticker,
          id: this.ticker,
          zIndex: 2,
          data: ohlc
      }, {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: volume,
          yAxis: 1
      }, {
          type: 'vbp',
          linkedTo: this.ticker,
          params: {
              volumeSeriesID: 'volume'
          },
          dataLabels: {
              enabled: false
          },
          zoneLines: {
              enabled: false
          }
      }, {
          type: 'sma',
          linkedTo: this.ticker,
          zIndex: 1,
          marker: {
              enabled: false
          }
      }]
      };

  }

  chart(data) {

    var parsed = data;
    var data1 = new Array(parsed.length);
    for (var i = 0; i < parsed.length; i++) {
        data1[i] = new Array(2);
    }
    for (var i = 0; i < parsed.length; i++) {
        var date2 = Date.parse(parsed[i].date);
        data1[i][0] = date2 ;
        data1[i][1] = parsed[i].close;
    }
    const timezone = new Date().getTimezoneOffset();
    var chartColor = 'red';
    if(this.change > 0){
      chartColor = 'green';
    } else if(this.change == 0){
      chartColor = 'black';
    }
    this.chartOptions = {
       rangeSelector: {
         enabled: false
       },
       time: {
         useUTC: false,
       },
       title: {
         text: this.ticker,
         style: {
            color: 'gray'
         }
       },
       xAxis: {
         crosshair: true,
         tickInterval: 60*60*1000
       },
       series: [{
         name: this.ticker,
         data: data1,
         color: chartColor,
         type: 'line',
         tooltip: {
           valueDecimals: 2
         }
       }]
      };

  }

  news(data){
    var data1 = data["articles"];
    for (var i = 0; i < data1.length && i < 20; i++) {
        if(data1[i].title != null && data1[i].urlToImage != null){
          this.newsArray[i] = data1[i];
        }
    }
  }

  clickNews(data){
    var day = new Date(data.publishedAt);
    data.publishedAt = day.toLocaleString('default', { month: 'long' }) + " " + day.getDate() + ", " + day.getFullYear();
    data["title1"] = encodeURIComponent(data.title);
    data["url1"] = encodeURIComponent(data.url);
    this.modalNews = data;
  }

  setModal(){
    this.total = 0;
    this.total = this.total.toFixed(2);
    this.totalDisplay = this.total;
    this.buydisabled = true;
    (<HTMLInputElement>document.getElementById("example-number-input")).value = "0";
  }

  buy(){
    var tot = 0;
    var num = 0;
    if(this.buyMap.has(this.ticker+"+"+this.name)){
      var str = this.buyMap.get(this.ticker+"+"+this.name);
      tot += parseFloat(str.split("x")[0]);
      num += parseInt(str.split("x")[1]);
    }
    tot += parseFloat(this.total);
    num += parseInt(this.buynumber.toString());
    this.buyMap.set(this.ticker+"+"+this.name, tot+"x"+num);
    localStorage.setItem("buyMap", JSON.stringify(Array.from(this.buyMap.entries())));
    this.alertTypeBuy = true;
    this.timerBuy = setTimeout(() => this.closeBuy(), 5000);
  }

  closeBuy(){
    clearTimeout(this.timerBuy);
    this.alertTypeBuy = false;
  }

  closeFav(){
    clearTimeout(this.timerFav);
    this.alertTypeFav = false;
  }

  closeNotFav(){
    clearTimeout(this.timerNotFav);
    this.alertTypeNotFav = false;
  }

  modelChanged(value){
     var curr = parseInt(value.srcElement.value);
     if(value.srcElement.value == ""){
       this.buydisabled = true;
       this.buynumber = 0;
       this.total = 0;
       this.total = this.total.toFixed(2);
       this.totalDisplay = this.total;
     } else {
       if(curr < 0){
          (<HTMLInputElement>document.getElementById("example-number-input")).value = "0";
       } else if(curr == 0){
          this.buydisabled = true;
          this.buynumber = 0;
          this.total = 0;
          this.total = this.total.toFixed(2);
          this.totalDisplay = this.total;
       } else {
          this.buydisabled = false;
          this.buynumber = curr;
          this.total = this.buynumber * this.last;
          this.total = this.total.toFixed(2);
          this.totalDisplay = (this.buynumber * this.last).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
       }
     }
  }

  fav(){
    this.isFav = !this.isFav;
    if(this.isFav){
      this.favList.push(this.ticker+"+"+this.name);
      localStorage.setItem("favList", JSON.stringify(this.favList));
      this.isFavIcon = "/assets/starfill.svg";
      this.closeNotFav();
      this.alertTypeFav = true;
      this.timerFav = setTimeout(() => this.closeFav(), 5000);
    } else {
      this.favList.splice(this.favList.indexOf(this.ticker+"+"+this.name), 1);
      localStorage.setItem("favList", JSON.stringify(this.favList));
      this.isFavIcon = "/assets/star.svg";
      this.closeFav();
      this.alertTypeNotFav = true;
      this.timerNotFav = setTimeout(() => this.closeNotFav(), 5000);
    }
  }

  initfav(){
    if(this.isFav){
      this.isFavIcon = "/assets/starfill.svg";
    } else {
      this.isFavIcon = "/assets/star.svg";
    }
  }

  init(){
    this.favList = JSON.parse(localStorage.getItem("favList"));

    if(this.favList == null) {
        this.favList = [];
    }

    this.buyMap = new Map(JSON.parse(localStorage.getItem("buyMap")));

    if(this.buyMap == null) {
      this.buyMap = new Map;
    }

    if(this.favList.includes(this.ticker+"+"+this.name)){
      this.isFav = true;
    } else {
      this.isFav = false;
    }

    this.initfav();
  }

  ngOnInit(): void {

     const id = this.route.snapshot.paramMap.get('id');

     this.api.getDetails(id)
      .pipe(
      catchError(error => {
          this.isLoading = false;
          this.notFound = true;
          return new Array();
      }),
      map((response: Response) => {

        if(response == null){
            this.isLoading = false;
            this.notFound = true;
            return;
        }

        this.desc = response["description"];
        this.name = response["name"];
        this.ticker = response["ticker"];
        this.startDate = response["startDate"];
        this.exchangecode = response["exchangeCode"];
        this.finishedDetails = true;

        this.init();

        this.api.getIex(id)
            .pipe(map((response: Response) => {
              this.high = response[0]["high"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              this.low = response[0]["low"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              this.open = response[0]["open"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              this.last = response[0]["last"].toFixed(2);
              this.lastDisplay = response[0]["last"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              this.prev = response[0]["prevClose"].toFixed(2);
              this.vol = response[0]["volume"].toLocaleString();

              this.mid = response[0]["mid"];
              if(this.mid != null){
                this.mid = this.mid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              }

              this.ask = response[0]["askPrice"];
              if(this.ask != null){
                this.ask = this.ask.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              }

              this.size = response[0]["askSize"];
              if(this.size != null){
                this.size = this.size.toLocaleString();
              }

              this.bidprice = response[0]["bidPrice"];
              if(this.bidprice != null){
                this.bidprice = this.bidprice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              }

              this.bidsize = response[0]["bidSize"];
              if(this.bidsize != null){
                this.bidsize = this.bidsize.toLocaleString();
              }

              if(this.last - this.prev > 0){
                  this.upOrDown = "/assets/up.svg";
                  this.marketColor = "text-success";
                } else if(this.last - this.prev == 0){
                  this.upOrDown = "";
                  this.marketColor = "";
                } else {
                  this.upOrDown = "/assets/down.svg";
                  this.marketColor = "text-danger";
              }

              this.change = (this.last-this.prev);
              this.percentage = (this.change*100/this.prev);
              this.prev = response[0]["prevClose"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              this.change = this.change.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
              this.percentage = this.percentage.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

              this.currentdate = new Date();
              this.isOpenDate = response[0]["timestamp"];
              var date = new Date(this.isOpenDate);

              if(this.currentdate - (+date) >= 60000){
                this.isOpen = "Closed on ";
                this.marketOpen = "marketClosed";
              } else {
                this.isOpen = "is Open";
                this.marketOpen = "marketOpen";
                this.isOpenDate = "";
                if(this.mid == null) {
                  this.mid = "-";
                }
                this.timer = setInterval(() => this.repeat(id), 15000);
              }

                this.finishedDetails1 = true;


                var today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

                var last = (date.getFullYear()-2) + "-" + (date.getMonth()+1) + "-" + date.getDate();

                this.api.getChart(id, today)
                      .pipe(map((response: Response) => {
                        this.chart(response);
                        this.finishedChart = true;
                      }))
                      .subscribe();


                this.api.getChart1(id, last)
                  .pipe(map((response: Response) => {
                    this.chart1(response);
                    this.finishedChart1 = true;
                    this.isLoading = false;
                  }))
                  .subscribe();

                this.api.getNews(id)
                  .pipe(map((response: Response) => {
                    this.news(response);
                    this.finishedNews = true;
                  }))
                  .subscribe();

            }))
            .subscribe();

      }))
      .subscribe();


  }

  repeat(id) {
    this.api.getIex(id)
      .pipe(map((response: Response) => {
        this.high = response[0]["high"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        this.low = response[0]["low"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        this.open = response[0]["open"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        this.last = response[0]["last"].toFixed(2);
        this.lastDisplay = response[0]["last"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        this.prev = response[0]["prevClose"].toFixed(2);
        this.vol = response[0]["volume"].toLocaleString();

        this.mid = response[0]["mid"];
        if(this.mid != null){
          this.mid = this.mid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        this.ask = response[0]["askPrice"];
        if(this.ask != null){
          this.ask = this.ask.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        this.size = response[0]["askSize"];
        if(this.size != null){
          this.size = this.size.toLocaleString();
        }

        this.bidprice = response[0]["bidPrice"];
        if(this.bidprice != null){
          this.bidprice = this.bidprice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        }

        this.bidsize = response[0]["bidSize"];
        if(this.bidsize != null){
          this.bidsize = this.bidsize.toLocaleString();
        }

        if(this.last - this.prev > 0){
            this.upOrDown = "/assets/up.svg";
            this.marketColor = "text-success";
          } else if(this.last - this.prev == 0){
            this.upOrDown = "";
            this.marketColor = "";
          } else {
            this.upOrDown = "/assets/down.svg";
            this.marketColor = "text-danger";
        }

        this.change = (this.last-this.prev);
        this.percentage = (this.change*100/this.prev);
        this.prev = response[0]["prevClose"].toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        this.change = this.change.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        this.percentage = this.percentage.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

        this.currentdate = new Date();
        this.isOpenDate = response[0]["timestamp"];
        var date = new Date(this.isOpenDate);

        if(+this.currentdate - (+date) >= 60000){
          this.isOpen = "Closed on ";
          this.marketOpen = "marketClosed";
          clearInterval(this.timer);
        } else {
          this.isOpen = "is Open";
          this.marketOpen = "marketOpen";
          this.isOpenDate = "";
          if(this.mid == null) {
            this.mid = "-";
          }
        }
        this.total = this.buynumber * this.last;
        this.total = this.total.toFixed(2);
        this.totalDisplay = (this.buynumber * this.last).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
        this.finishedDetails1 = true;
        var today = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();

        this.api.getChart(id, today)
              .pipe(map((response: Response) => {
                this.chart(response);
                this.finishedChart = true;
                this.updateFlag = true;
              }))
              .subscribe();
        })).subscribe();
  }


  ngOnDestroy() {
     if(this.timer != null)
       clearInterval(this.timer);
  }

}
