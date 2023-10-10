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

        switch (language) {
            case 'en-US':
                message = this.englishError(errorStatus)
            case 'pt':
                message = this.portugueseError(errorStatus)
            case 'es':
                message = this.spanishError(errorStatus)
            case 'fr':
                message = this.françaisError(errorStatus)
            // case 'sag':
            //     message = this.sangoError(errorStatus)
        }
        return message
    }

    public englishError(errorStatus) {
        if (errorStatus == 500)
            return 'Internal Server error, please try again. Contact support if the problem persists.'

        if (errorStatus == 400)
            return 'Service not found.'

        return errorStatus
    }

    public portugueseError(errorStatus) {
        if (errorStatus == 500)
            return 'Erro interno no Servidor, por favor tente novamente. Entre em contato com o suporte se o problema persistir.'

        if (errorStatus == 400)
            return 'Serviço não encontrado.'

        return errorStatus
    }

    public spanishError(errorStatus) {
        if (errorStatus == 500)
            return 'Error interno del servidor, inténtalo de nuevo. Póngase en contacto con el soporte si el problema persiste.'

        if (errorStatus == 400)
            return 'Servicio no encontrado.'

        return errorStatus
    }


    public françaisError(errorStatus) {
        if (errorStatus == 500)
            return 'Erreur interne de serveur, veuillez essayer de nouveau. Contactez le support si le problème persiste.'

        if (errorStatus == 400)
            return 'Service introuvable.'

        return errorStatus
    }

    // public sangoError(errorStatus) {
    //     if (errorStatus == 500)
    //         return 'Erreur interne de serveur, veuillez essayer de nouveau.'

    //     if (errorStatus == 400)
    //         return 'Service introuvable.'

    //     return errorStatus
    // }

}
