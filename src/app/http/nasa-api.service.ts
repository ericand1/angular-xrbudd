import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class NasaApiService {
  private _baseUrl = "https://api.nasa.gov";
  constructor(private readonly _httpClient: HttpClient) {}

  /**
   * Note: there is an interceptor below that takes any HttpClient request and modifies it, it is injected via the AppModule
   */
  getAstroidsNearEarth(startDate: Date, endDate?: Date): Promise<any> {
    // Endpoint enforces a default end_date of 7 days after the start_date if not provided
    let params = new HttpParams().append('start_date', this._dateFormat(startDate));

    if (endDate) {
      params = params.append('end_date', this._dateFormat(endDate));
    }

    return this._httpClient
      .get(`${this._baseUrl}/neo/rest/v1/feed`, { params: params })
      .toPromise();
  }

  private _dateFormat(date: Date) {
    return date.toISOString().split("T")[0];
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const newReq = req.clone({
      params: (req.params || new HttpParams()).set(
        'api_key',
        '<replace-with-real-key-when-available>'
      )
    });

    return next.handle(newReq);
  }
}

export interface AstroidParams {
  start_date: string;
  end_date?: string;
}
