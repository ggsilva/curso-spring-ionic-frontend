import { FieldMessage } from './../models/field_message';
import { StorageService } from './../services/storage.service';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx'; // IMPORTANTE: IMPORT ATUALIZADO
import { AlertController } from 'ionic-angular';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        public storageService: StorageService,
        public alertCtrl: AlertController
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch((error, caught) => {

                let errorObj = error;
                if (errorObj.error) {
                    errorObj = errorObj.error;
                }
                if (!errorObj.status) {
                    errorObj = JSON.parse(errorObj);
                }

                console.log("Erro detectado pelo interceptor:");
                console.log(errorObj);

                switch (errorObj.status) {
                    case 401:
                        this.handle401();
                        break;

                    case 403:
                        this.handle403();
                        break;

                    case 422:
                        this.handle422(errorObj);
                        break;

                    default:
                        this.handleDefaultEror(errorObj);
                }

                return Observable.throw(errorObj);
            }) as any;
    }

    handle401() {
        let alert = this.alertCtrl.create({
            title: 'Falha de autenticação',
            message: 'Email ou senha incorretos',
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    handle403() {
        this.storageService.setLocalUser(null);
    }

    handle422(errorObj: any) {
        let alert = this.alertCtrl.create({
            title: 'Erro de validação',
            message: this.listErrors(errorObj.fields),
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

    listErrors(errors: FieldMessage[]): string {
        let s: string = '';
        errors.forEach(e => {
            s = s + '<p><strong>' + e.fieldName + "</strong>: " + e.message + '</p>';
        });
        return s;
    }

    handleDefaultEror(errorObj: any) {
        let alert = this.alertCtrl.create({
            title: 'Erro ' + errorObj.status + ': ' + errorObj.error,
            message: errorObj.message,
            enableBackdropDismiss: false,
            buttons: [
                {
                    text: 'Ok'
                }
            ]
        });
        alert.present();
    }

}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};