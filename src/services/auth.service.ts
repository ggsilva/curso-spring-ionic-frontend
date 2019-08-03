import { LocalUser } from './../models/local_users.dto';
import { API_CONFIG } from './../config/api.config';
import { CredenciaisDTO } from './../models/credenciais.dto';
import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { JwtHelper } from 'angular2-jwt';

@Injectable()
export class AuthService {

    jwtHelper: JwtHelper = new JwtHelper();

    constructor(
        public http: HttpClient,
        public storageService: StorageService
    ) { }

    authenticate(credenciais: CredenciaisDTO) {
        return this.http.post(`${API_CONFIG.baseUrl}/login`, credenciais,
            {
                observe: 'response',
                responseType: 'text'
            })
    }

    refreshToken() {
        return this.http.post(`${API_CONFIG.baseUrl}/auth/refresh_token`, {},
            {
                observe: 'response',
                responseType: 'text'
            })
    }

    successfulLogin(authorizationValue: string) {
        let user: LocalUser = {
            token: authorizationValue.substring(7),
            email: this.jwtHelper.decodeToken(authorizationValue.substring(7)).sub
        }
        this.storageService.setLocalUser(user);
    }

    logout() {
        this.storageService.setLocalUser(null);
    }

}