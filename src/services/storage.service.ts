import { STORAGE_KEYS } from './../config/storage_keys.config';
import { LocalUser } from './../models/local_users.dto';
import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {

    constructor() { }

    getLocalUser(): LocalUser {
        let usr = localStorage.getItem(STORAGE_KEYS.localUser);
        if (usr == null)
            return null;
        return JSON.parse(usr);
    }

    setLocalUser(usr: LocalUser) {
        if(usr == null)
            localStorage.removeItem(STORAGE_KEYS.localUser);
        else
            localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(usr));
    }

}