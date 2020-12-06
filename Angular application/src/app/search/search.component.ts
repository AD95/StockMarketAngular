import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, tap, switchMap, finalize, filter, map } from 'rxjs/operators';
import { Router } from '@angular/router'
import { ApiService } from '../api.service'


@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})

export class SearchComponent implements OnInit {
  searchStocksCtrl = new FormControl();
  filteredStocks: any;
  isLoading = false;
  selectedValue: any;

  constructor(private router: Router, private api: ApiService) { }

  displayFn(stock){
    return stock ? stock.ticker : undefined;
  };

  goToPage(event) {
      if(this.selectedValue != undefined){
        this.router.navigate(['/details/'+ this.selectedValue]);
      }
      event.preventDefault();
  };

  ngOnInit(): void {

    this.searchStocksCtrl.valueChanges
      .pipe(
        filter(val => typeof val === 'string'),
        debounceTime(500),
        tap(() => {
          this.filteredStocks = [];
          this.isLoading = true;
        }),
        switchMap(value => this.api.getSearch(value)
          .pipe(
            //map(val => val.filter(val => val['name'] != null)),
            finalize(() => {
              this.isLoading = false
            })
          )
        )
      )
      .subscribe((data: Array<any>) => {
        if (data != undefined) {
          this.filteredStocks = data.filter(val => val['name'] != null);
        }
      });
      this.searchStocksCtrl.valueChanges
            .pipe(
              filter(val => typeof val === 'object')
              )
              .subscribe(data => {
                      if (data != undefined) {
                        this.selectedValue = data.ticker;
                      }
              });
  }

}
