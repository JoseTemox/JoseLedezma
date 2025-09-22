import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, take, throwError } from 'rxjs';
import { GlobalModalService } from '../components/global-modal-messages/services/global-modal-service.service';
import { inject } from '@angular/core';

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) {
  const globalModalService = inject(GlobalModalService);
  const authToken = 'Bearer 123';
  const newReq = req.clone({
    headers: req.headers.append('Authorization', authToken),
  });
  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      globalModalService
        .error(
          error?.error?.message ?? 'Contacte con el Administrador',
          `Error - ${error.status}`
        )
        .pipe(take(1));

      return throwError(() => error.message);
    })
  );
}
