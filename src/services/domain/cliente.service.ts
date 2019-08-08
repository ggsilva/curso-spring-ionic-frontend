import { StorageService } from './../storage.service';
import { API_CONFIG } from './../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ClienteDTO } from '../../models/cliente.dto';

@Injectable()
export class ClienteService {
    constructor(
        public httpClient: HttpClient,
        public storageService: StorageService
    ) { }

    findByEmail(email: string): Observable<ClienteDTO> {
        return this.httpClient.get<ClienteDTO>(`${API_CONFIG.baseUrl}/clientes/email?value=${email}`)
    }

    getImageFromBucket(id: string): Observable<any> {
        let url = `${API_CONFIG.bucketBaseUrl}/cp${id}.jpg`;
        return this.httpClient.get(url, { responseType: 'blob' });
    }

    insert(cliente: any) {
        return this.httpClient.post(`${API_CONFIG.baseUrl}/clientes`, cliente,
            {
                observe: 'response',
                responseType: 'text'
            })
    }

}