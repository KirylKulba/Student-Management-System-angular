import { Role } from "./role.model";

export class User{
    constructor(
        public id:number,
        public username:string,
        private _token:string,
        private _tokenExpirationDate:Date,
        //public userRoles:Role[],
        public roles:Role[]
    ){}

    get token(){
        if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate){
            return null;
        }
        return this._token;
    }
}