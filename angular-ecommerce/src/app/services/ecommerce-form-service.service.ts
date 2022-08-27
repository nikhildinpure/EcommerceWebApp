import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class EcommerceFormServiceService {

  constructor(private httpClient:HttpClient) { }

  getCreditCardMonths() : Observable <number[]>{
    let data : number [] = [];
    let startMonth = new Date().getMonth() + 1;
    
    for(let theMonth = startMonth; theMonth <= 12 ; theMonth++ ){
      data.push(theMonth);
    }

    return  of(data);
  }

  getCreditCardYears() : Observable <number[]>{
    let data : number [] = [];
    let startYear = new Date().getFullYear();
    let endYear = startYear + 10;

    for(let theYear = startYear; theYear <= endYear ; theYear++ ){
      data.push(theYear);
    }

    return  of(data);
  }

  getCountries(): Observable<Country []>{
    const countryUrl = 'http://localhost:8080/api/countries';
    return this.httpClient.get<GetResponseCountry>(countryUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode:String): Observable<State []>{
    const stateUrl = 'http://localhost:8080/api/states/search/findByCountryCode?code='+countryCode;
    return this.httpClient.get<GetResponseState>(stateUrl).pipe(
      map(response => response._embedded.states)
    );
  }


}

interface GetResponseCountry{
  _embedded : {
    countries: Country [];
  }
}

interface GetResponseState{
  _embedded : {
    states: State [];
  }
}
