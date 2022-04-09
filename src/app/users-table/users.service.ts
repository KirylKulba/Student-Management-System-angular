import { Injectable } from "@angular/core";
import { User } from "../auth/user.model";
import { DataStorage } from "../shared/data-storage.service";

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private dataStorage:DataStorage){}

    getUsers(){
        return this.dataStorage.getUsers();
    }

    getRoles(){
        return this.dataStorage.getRoles();
    }

    changeRoles(user:User){
        return this.dataStorage.changeUserRoles(user);
    }

}