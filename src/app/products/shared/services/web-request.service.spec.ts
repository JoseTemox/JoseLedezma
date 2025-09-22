import { TestBed } from '@angular/core/testing';

import { WebRequest } from './web-request.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';

describe('WebRequest', () => {
  let service: WebRequest;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebRequest,
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(WebRequest);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a GET request with correct URL and parameters', () => {
    const dummyResponse = { data: 'test' };
    const uri = 'test-uri';
    const params = { id: '123' };
    const options = { extraHeaders: { 'Custom-Header': 'value' } };

    service.get(uri, params, options).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.urlApi}/${uri}?id=123`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Custom-Header')).toBe('value');
    expect(req.request.urlWithParams).toContain('id=123');

    req.flush(dummyResponse);
  });

  it('should perform a POST request with payload and correct headers', () => {
    const dummyResponse = { message: 'created' };
    const uri = 'test-uri';
    const payload = { name: 'new product' };

    service.post(uri, payload).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.urlApi}/${uri}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);

    req.flush(dummyResponse);
  });

  it('should perform a PUT request with payload and correct headers', () => {
    const dummyResponse = { message: 'updated' };
    const uri = 'test-uri/1';
    const payload = { name: 'updated product' };

    service.put(uri, payload).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.urlApi}/${uri}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(payload);

    req.flush(dummyResponse);
  });

  it('should perform a DELETE request with correct URL and parameters', () => {
    const dummyResponse = { message: 'deleted' };
    const uri = 'test-uri/1';
    const params = { force: 'true' };

    service.delete(uri, params).subscribe((response) => {
      expect(response).toEqual(dummyResponse);
    });

    const req = httpMock.expectOne(`${environment.urlApi}/${uri}?force=true`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.urlWithParams).toContain('force=true');

    req.flush(dummyResponse);
  });
});
