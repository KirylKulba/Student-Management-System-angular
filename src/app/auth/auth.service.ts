import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { User } from "./user.model";
import { Role } from "./role.model";
import { Router } from "@angular/router";

export interface AuthResponse{
    id:number;
	username:string;
    _token:string;
    expiresIn: string;
    userRoles:Role[];
}

@Injectable({providedIn:'root'})
export class AuthService{

    authUrl = 'http://localhost:8080/users/';

    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer:any;

    constructor(private http:HttpClient, private router:Router){}

    login(username_:string, password_:string){
        return this.http.post<AuthResponse>(
            this.authUrl.concat("authenticate"),
            {
                username:username_,
                password:password_
            }
        ).pipe(catchError(this.handleError),tap(resData => {
            this.handleAuthentication(resData);
        }));
    }

    autoLogin(){
        const userData:{
            id:number;
	        username:string;
            _token:string;
            _tokenExpirationDate:Date;
            userRoles:Role[];
        } = JSON.parse(localStorage.getItem('userData'));
        if(!userData){
            return;
        }
        const loadedUser = new User(userData.id, 
                                    userData.username, 
                                    userData._token, 
                                    new Date(userData._tokenExpirationDate), 
                                    userData.userRoles);

        if(loadedUser.token){
            this.user.next(loadedUser);
            const expirationDuration =
                new Date(userData._tokenExpirationDate).getTime() -
                new Date().getTime();
            this.autoLogout(expirationDuration);
        }
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth']);
        localStorage.removeItem('userData');
        if(this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }

    autoLogout(expirationDuration:number){
        this.tokenExpirationTimer = setTimeout(()=>{
            this.logout();
        }, expirationDuration);
    }

    signup(username:string, password:string, email:string):Observable<AuthResponse>{
        return this.http.post<AuthResponse>(
            this.authUrl.concat("register"),
            {
                username:username,
                password:password,
                email:email
            }
        ).pipe(catchError(this.handleError));
    }

    private handleAuthentication(resData:AuthResponse){
        let expiresInNum:number = +resData.expiresIn;
        const expirationDate = new Date(new Date().getTime() +expiresInNum * 1000);
        const user:User = new User(resData.id, 
            resData.username, 
            resData._token, 
            expirationDate, 
            resData.userRoles);
        this.user.next(user);
        this.autoLogout(expiresInNum * 1000);
        localStorage.setItem('userData',JSON.stringify(user));
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMessage = "An unknown error occurred!";

            switch (errorRes.error.message){
                case 'USER_NOT_FOUND':
                    errorMessage = 'No user with that login!';
                    break;
                case 'Bad credentials':
                    errorMessage = 'Incorrect password!';
                    break;
                case 'USER_ALREADY_EXISTS':
                    errorMessage = 'This login is already taken';
                    break;
            }
        return throwError(errorMessage);
    }
}