import { Component, OnInit } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../api.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css']
})
export class PortfolioComponent implements OnInit {

  constructor(private router: Router, private api: ApiService) { }


  isLoading = true;
  timerNotFav;
  alertTypeNotFav;

  ticker;
  total;
  totalDisplay;
  last;
  lastDisplay;
  buynumber;
  buydisabled = true;
  currtotal;
  name;
  index;
  avg;

  buyMap: any

  watchList: any = []

  clickWatch(value){
      this.router.navigate(['/details/'+ value.ticker]);
  }

  setModal(watch){
      this.ticker = watch.ticker;
      this.last = watch.last;
      this.lastDisplay = watch.lastDisplay;
      this.name = watch.name;
      this.avg = watch.avg;
      this.total = 0;
      this.total = this.total.toFixed(2);
      this.totalDisplay = this.total;
      this.currtotal = watch.num;
      this.buydisabled = true;
      this.index = this.watchList.indexOf(watch);
      (<HTMLInputElement>document.getElementById("example-number-input")).value = "0";
      (<HTMLInputElement>document.getElementById("example-number-input1")).value = "0";
      //(<HTMLInputElement>document.getElementById("example-number-input1")).max = watch.num + "";
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
    (<HTMLInputElement>document.getElementById("example-number-input")).value = "0";
    this.update(tot, num);
    this.ngOnInit();
  }

  sell(){
    var tot = 0;
    var num = 0;
    if(this.buyMap.has(this.ticker+"+"+this.name)){
      var str = this.buyMap.get(this.ticker+"+"+this.name);
      tot += parseFloat(str.split("x")[0]);
      num += parseFloat(str.split("x")[1]);
    }
    tot -= parseFloat(this.total);
    num -= parseInt(this.buynumber.toString());
    this.buyMap.set(this.ticker+"+"+this.name, tot+"x"+num);
    if(num == 0){
        this.buyMap.delete(this.ticker+"+"+this.name);
        this.watchList.splice(this.index, 1);
    }
    localStorage.setItem("buyMap", JSON.stringify(Array.from(this.buyMap.entries())));
    (<HTMLInputElement>document.getElementById("example-number-input1")).value = "0";
    this.update(tot, num);
    this.ngOnInit();
  }

  update(tot, num){
    this.watchList[this.index].num = num;
    this.watchList[this.index].numDisplay = num.toLocaleString();
    this.watchList[this.index].tot = tot.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    this.watchList[this.index].avg = (tot/num).toFixed(2);
    this.watchList[this.index].avgDisplay = (tot/num).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
    this.watchList[this.index].tot1 = (this.watchList[this.index].last*num).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
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

  modelChanged1(value){
    var curr = parseInt(value.srcElement.value);
    if(value.srcElement.value == ""){
     this.buydisabled = true;
     this.buynumber = 0;
     this.total = 0;
     this.total = this.total.toFixed(2);
     this.totalDisplay = this.total;
    } else {
      var t = parseInt(this.currtotal);
       if(curr == 0){
          this.buydisabled = true;
          this.buynumber = 0;
          this.total = 0;
          this.total = this.total.toFixed(2);
          this.totalDisplay = this.total;
       } else if(curr > t) {
          this.buydisabled = true;
          this.total = curr * this.avg;
          this.total = this.total.toFixed(2);
          this.totalDisplay = (curr * this.avg).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
       } else {
          this.buydisabled = false;
          this.buynumber = curr;
          this.total = this.buynumber * this.avg;
          this.total = this.total.toFixed(2);
          this.totalDisplay = (this.buynumber * this.avg).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
       }
     }
  }

ngOnInit(): void {

  this.buyMap = new Map(JSON.parse(localStorage.getItem("buyMap")));

  if(this.buyMap == null || this.buyMap.length == 0) {
      this.buyMap = new Map();
      this.isLoading = false;
      return;
  }

  var allIds = "";

  var buyList = [];
  var names = new Map;

  this.buyMap.forEach(function(value, key) {
    var tmp = key.split("+")[0];
    names.set(tmp, key.split("+")[1]);
    buyList.push(tmp);
    allIds += tmp + ",";
  });

  buyList = buyList.sort();

  var mainArr = new Map;

    this.api.getIex(allIds)
    .pipe(
      map((response: Response) => {

        for(var i = 0; i < buyList.length; i++) {

            var newArr = new Map;

            var ticker = response[i]["ticker"];

            newArr['ticker'] = ticker;
            newArr['last'] = (response[i]["last"]).toFixed(2);
            newArr['lastDisplay'] = (response[i]["last"]).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

            mainArr.set(ticker, newArr);
        }

        for(var i = 0; i < buyList.length; i++) {
            var tick = buyList[i];
            var arr = this.buyMap.get(tick+"+"+names.get(tick));
            var total = arr.split("x")[0];
            var num = arr.split("x")[1];
            var temp = mainArr.get(tick);
            temp['num'] = num;
            temp['numDisplay'] = parseInt(num).toLocaleString();
            temp['avg'] = (total/num).toFixed(2);
            temp['avgDisplay'] = (total/num).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            temp['tot'] = parseFloat(total).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            temp['name'] = names.get(tick);

            var last = temp['last'];
            temp['tot1'] = (last*num).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
            if(last - temp['avg'] > 0){
              temp['upOrDown'] = "/assets/up.svg";
              temp['marketColor'] = "text-success";
            } else if(last - temp['avg'] == 0){
              temp['upOrDown'] = "";
              temp['marketColor'] = "";
            } else {
              temp['upOrDown'] = "/assets/down.svg";
              temp['marketColor'] = "text-danger";
            }

            var change = (last-temp['avg']);
            temp['change'] = (last-temp['avg']).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});

            this.watchList[i] = (temp);
        }

        this.isLoading = false;


      }))
      .subscribe();
  }

}

