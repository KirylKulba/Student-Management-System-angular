import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MessageService } from '../websockets/sockets.service';
import { AuthResponse, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  isLoginMode:boolean = true;
  error:string = null;
  success:string = null;

  constructor(private authService:AuthService,
              private router:Router,
              private messageService:MessageService ) { }

  ngOnInit(): void {
  }

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form:NgForm){
    const username = form.value.username;
    const password = form.value.password;


    let authObs: Observable<AuthResponse>;
    
    if(this.isLoginMode){
      authObs = this.authService.login(username, password);
    }else{
      const email:string = form.value.email;
      if(email.split("@")[1]!="admin.edu" && email.split("@")[1]!="lecturer.edu"){
        this.error = "Only admins and lecturers can register here!";
        return ;
      }
      authObs = this.authService.signup(username, password, email);
    }

    authObs.subscribe(
      response => {
        if(!this.isLoginMode){
          this.error = null;
          this.success = "New user was created!"
        }else{
          this.router.navigate(['']);
          this.messageService.initializeWebSocketConnection(response);
        }
      },errorMessage => {
        this.error = errorMessage;
        this.success = null;
      }
    )

    form.reset();
    
  }

}
