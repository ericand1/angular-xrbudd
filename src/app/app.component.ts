import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NasaApiService } from './http/nasa-api.service';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  name = 'Search for Astroids';

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  objects: DateOfAstroids[] = [];

  constructor(private readonly _nasaApi: NasaApiService) {
    this._configureFormChanges();
  }

  private async _configureFormChanges() {
    this.range.valueChanges.subscribe(async (model: DateRangeModel) => {
      if (model.start && model.end) {
        this.objects = [];
        const results = await this._nasaApi.getAstroidsNearEarth(
          new Date(model.start)
        );

        this._parseResults(results.near_earth_objects);
      }
    });
  }

  private _parseResults(results: any) {
    const dates = Object.keys(results);
    this.objects = [];
    dates.forEach(date => {
      const rawAstroids = results[date];
      this.objects.push({
        date: date,
        astroids: rawAstroids.map(a => {
          return {
            name: a.name,
            isPotentiallyHazardous: a.is_potentially_hazardous_asteroid,
            nasaUrl: a.nasa_jpl_url
          };
        })
      });
    });
  }
}

export interface DateRangeModel {
  start: string;
  end: string;
}

export interface DateOfAstroids {
  date: string;
  astroids: Astroid[];
}

export interface Astroid {
  name: string;
  isPotentiallyHazardous: string;
  nasaUrl: string;
}
