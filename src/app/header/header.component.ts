import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Role } from '../auth/role.model';
import { getUserRole, UserRole } from '../auth/user-role.enum';
import { User } from '../auth/user.model';
import { StudentService } from '../students/student.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSub:Subscription;
  isAuthenticated:boolean = false;
  user:User = null;
  userRoles = [];
  studentSub:Subscription;

  constructor(private authService:AuthService, private studentService:StudentService ,private router:Router) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !user ? false : true;
      
      if(this.isAuthenticated){
        this.user = user;
        for(var role of this.user.roles){
          let userRole:UserRole = getUserRole(role.name);
          this.userRoles.push(userRole);
        }
      }
      
    });
  }

  get UserRole(){
    return UserRole;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout(){
    this.authService.logout();
    this.userRoles = [];
    this.router.navigate(['/auth']);
  }

  studentProfile(){
    this.studentSub = this.studentService.getStudentByUserId(this.user.id).subscribe(
      student =>{
        this.router.navigate(['/students/',student.id]);
      }
    );
  }

}
