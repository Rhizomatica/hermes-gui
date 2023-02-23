import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.authenticationService.logout();
                location.reload();
            }

            //TODO - REPORT FEEDBACK
            //TODO - Translate returns
            if (err.status === 500)
                return throwError('Internal Server error, please try again. If this error persists send a report feedback.');

            if (err.status === 400)
                return throwError('Service not found. If this error persists send a report feedback.');

            const error = err.error.message || err.statusText;
            return throwError(error);
        }));
    }
}
