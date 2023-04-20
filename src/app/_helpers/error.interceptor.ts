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
                this.authenticationService.logout()
                location.reload()
            }

            return throwError(this.translateError(err.status))
        }));
    }

    public translateError(errorStatus) {
        var language = localStorage.getItem('language')
        var message = ''

        if (language === 'en-US') {
            message = this.englishError(errorStatus)
        }

        if (language === 'pt') {
            message = this.portugueseError(errorStatus)
        }

        if (language == 'es') {
            message = this.spanishError(errorStatus)
        }

        return message
        // + ' If this error persists send a report feedback.'
    }

    public englishError(errorStatus) {
        if (errorStatus == 500)
            return 'Internal Server error, please try again.'

        if (errorStatus == 400)
            return 'Service not found.'

        return errorStatus
    }

    public portugueseError(errorStatus) {
        if (errorStatus == 500)
            return 'Erro interno no Servidor, por favor tente novamente.'

        if (errorStatus == 400)
            return 'Serviço não encontrado.'

        return errorStatus
    }

    public spanishError(errorStatus) {
        if (errorStatus == 500)
            return 'Error interno del servidor, inténtalo de nuevo.'

        if (errorStatus == 400)
            return 'Servicio no encontrado.'

        return errorStatus
    }
}
