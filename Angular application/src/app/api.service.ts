import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http:HttpClient) { }

  //local = "http://localhost:3000";
  local = "";

  getSearch(value) {
        //return this.http.get("https://cors-anywhere.herokuapp.com/https://api.tiingo.com/tiingo/utilities/search?token=b4e95182bcfae3fa31c6d095f26de94e3514a17b&query=" + value);
        return this.http.get(this.local + "/api/search?value=" + value);
  }

  getDetails(value) {
        //return this.http.get("https://cors-anywhere.herokuapp.com/https://api.tiingo.com/tiingo/daily/" + value + "?token=b4e95182bcfae3fa31c6d095f26de94e3514a17b");
        return this.http.get(this.local + "/api/details?value=" + value);
  }

  getIex(value) {
        //return this.http.get("https://cors-anywhere.herokuapp.com/https://api.tiingo.com/iex?tickers=" + value + "&token=b4e95182bcfae3fa31c6d095f26de94e3514a17b");
        return this.http.get(this.local + "/api/iex?value=" + value);
  }

  getChart(value, date) {
         //return this.http.get("https://cors-anywhere.herokuapp.com/https://api.tiingo.com/iex/" + value + "/prices?startDate=" + date + "&resampleFreq=5min&token=b4e95182bcfae3fa31c6d095f26de94e3514a17b");
         return this.http.get(this.local + "/api/chart?value=" + value + "&date=" + date);
  }

  getNews(value) {
        //return this.http.get("https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?apiKey=f3346f1e651545cb8b4d2a1320357fd4&q="+value);
        return this.http.get(this.local + "/api/news?value=" + value);
    }

  getChart1(value, last) {
       //return this.http.get("https://cors-anywhere.herokuapp.com/https://api.tiingo.com/iex/" + value + "/prices?startDate=" + last + "&endDate=" + date + "&resampleFreq=60min&columns=open,high,low,close,volume&token=b4e95182bcfae3fa31c6d095f26de94e3514a17b");
       return this.http.get(this.local + "/api/chart1?value=" + value + "&stdate=" + last);
  }

}
