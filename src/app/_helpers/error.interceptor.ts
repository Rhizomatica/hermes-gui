import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthenticationService } from '../_services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: any) => {

            if (err.status === 401) {
                this.authenticationService.logout()
                location.reload()
            }
            return throwError(() => new Error(this.translateError(err.status)))
        }));
    }

    public translateError(errorStatus: number): string {
        var language = localStorage.getItem('language')
        var message = ''

        switch (language) {
            case 'en-US':
                message = this.englishError(errorStatus)
                break
            case 'pt':
                message = this.portugueseError(errorStatus)
                break
            case 'es':
                message = this.spanishError(errorStatus)
                break
            case 'fr':
                message = this.francaisError(errorStatus)
                break
            case 'ar':
                message = this.arabicError(errorStatus)
                break
            default:
                message = this.englishError(errorStatus)
                break
        }
        return message
    }

    public englishError(errorStatus: number): string {
        switch (errorStatus) {
            case 400:
                return 'Service not found.'
            case 409:
                return 'Record already exists, choose another name for the record or delete the existing record to create a new one with the same name'
            case 413:
                return 'File is too big, max size is 20.48 MB'
            case 431:
                return 'Request exceeds the size allowed by the server.'
            case 500:
                return 'Internal Server error, please try again. Contact support if the problem persists.'
            default:
                return 'Internal Server error, please try again. Contact support if the problem persists.'
        }
    }

    public portugueseError(errorStatus: number): string {

        switch (errorStatus) {
            case 400:
                return 'Serviço não encontrado.'
            case 409:
                return 'Registro já existe, escolha outro nome para o registro ou delete o registro existente para criar um novo com o mesmo nome.'
            case 413:
                return 'Tamanho do arquivo é muito grande, tamanho maximo é de 20.48 MB.'
            case 431:
                return 'Requisição excede o tamanho permitido pelo servidor.'
            case 500:
                return 'Erro interno no Servidor, por favor tente novamente. Entre em contato com o suporte se o problema persistir.'
            default:
                return 'Erro interno no Servidor, por favor tente novamente. Entre em contato com o suporte se o problema persistir.'
        }
    }

    public spanishError(errorStatus: number): string {

        switch (errorStatus) {
            case 400:
                return 'Servicio no encontrado.'
            case 409:
                return 'El registro ya existe, elija otro nombre para el registro o elimine el registro existente para crear uno nuevo con el mismo nombre.'
            case 413:
                return 'El tamaño del archivo es muy grande, el tamaño máximo es 20,48 MB.'
            case 431:
                return 'La solicitud excede el tamaño permitido por el servidor.'
            case 500:
                return 'Error interno del servidor, inténtalo de nuevo. Póngase en contacto con el soporte si el problema persiste.'
            default:
                return 'Error interno del servidor, inténtalo de nuevo. Póngase en contacto con el soporte si el problema persiste.'
        }
    }


    public francaisError(errorStatus: number): string {

        switch (errorStatus) {
            case 400:
                return 'Service introuvable.'
            case 409:
                return 'Enregistrement déjà existant, choisissez un autre nom pour l\'enregistrement ou supprimez l\'enregistrement existant pour en créer un nouveau avec le même nom.'
            case 413:
                return 'Le fichier est trop volumineux, la taille maximum est 20.48 MB'
            case 431:
                return 'La demande dépasse la taille autorisée par le serveur.'
            case 500:
                return 'Erreur interne de serveur, veuillez essayer de nouveau. Contactez le support si le problème persiste.'
        }

        return 'Erreur interne de serveur, veuillez essayer de nouveau. Contactez le support si le problème persiste.'
    }

    public arabicError(errorStatus: number): string {

        switch (errorStatus) {
            case 400:
                return 'لم يتم العثور على الخدمة.'
            case 409:
                return 'السجل موجود بالفعل، اختر اسمًا آخر للسجل أو احذف السجل الموجود لإنشاء سجل جديد بنفس الاسم.'
            case 413:
                return 'الملف كبير جدًا؛ الحد الأقصى للحجم هو 20.48 ميجابايت.'
            case 431:
                return 'يتجاوز حجم الطلب الحد المسموح به من قبل الخادم.'
            case 500:
                return 'حدث خطأ في الخادم الداخلي، يرجى المحاولة مرة أخرى. تواصل مع الدعم الفني إذا استمرت المشكلة.'
        }

        return 'حدث خطأ في الخادم الداخلي، يرجى المحاولة مرة أخرى. تواصل مع الدعم الفني إذا استمرت المشكلة.'
    }
}
