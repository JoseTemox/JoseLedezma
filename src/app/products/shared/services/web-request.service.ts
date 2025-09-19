import { inject, Injectable } from '@angular/core';
import { defer, Observable } from 'rxjs';
import { RequestOptions } from '../interfaces/web-request.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WebRequest {
  public url = environment.urlApi;
  private readonly http = inject(HttpClient);

  get(uri: string, params?: any, options?: RequestOptions): Observable<any> {
    return defer(() =>
      this.http.get<any>(`${this.url}/${uri}`, {
        params: params,
        headers: options?.extraHeaders,
        responseType: options?.httpOptions?.responseType,
      })
    );
  }

  post(
    uri: string,
    payload: any,
    params?: any,
    options?: RequestOptions
  ): Observable<any> {
    return defer(() =>
      this.http.post<any>(`${this.url}/${uri}`, payload, {
        params: params,
        headers: options?.extraHeaders,
        responseType: options?.httpOptions?.responseType,
      })
    );
  }

  put(
    uri: string,
    payload?: any,
    params?: any,
    options?: RequestOptions
  ): Observable<any> {
    return defer(() =>
      this.http.put<any>(`${this.url}/${uri}`, payload, {
        params: params,
        headers: options?.extraHeaders,
      })
    );
  }

  delete(uri: string, params?: any, options?: RequestOptions): Observable<any> {
    return defer(() =>
      this.http.delete<any>(`${this.url}/${uri}`, {
        params: params,
        headers: options?.extraHeaders,
      })
    );
  }
}
