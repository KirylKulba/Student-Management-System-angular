import { Component, OnDestroy, OnInit } from '@angular/core';
import { Role } from '../auth/role.model';
import { User } from '../auth/user.model';
import { Major } from '../shared/models/major.model';
import { serialUnsubscriber, SubscriptionCollection } from '../shared/utils/subs-collection.interface';
import { UserService } from './users.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit, OnDestroy {
  private subscriptions: SubscriptionCollection = {};

  users:User[];
  roles:Role[];

  user:User;
  elemIndex:number;

  availableUserRoles:Role[];
  userRoles:Role[];

  constructor(private userService:UserService) { }

  ngOnInit(): void {

    this.subscriptions['users'] = this.userService.getUsers().subscribe(
      (users) => {
          this.users = users;
      }
    );

    this.subscriptions['roles'] = this.userService.getRoles().subscribe(
      (roles) => {
          this.roles = roles;
      }
    );
  }

  onConfigureRoles(elementId:number){

    this.user = this.users[elementId];
    this.elemIndex = elementId;

    this.userRoles = this.user.roles;
    this.availableUserRoles = this.roles.filter(role_ => !this.userRoles.some(role => role.name===role_.name));
  }

  ngOnDestroy(): void {
    serialUnsubscriber(...Object.values(this.subscriptions));
  }

  onAddRole(index:number){
    let role:Role = this.availableUserRoles[index];
    
    this.userRoles.push(role);
    this.availableUserRoles.splice(index,1);
  }

  onRemoveRole(index:number){
    let role:Role = this.userRoles[index];
    
    this.availableUserRoles.push(role);
    this.userRoles.splice(index,1);
  }

  submitUserRoles(){
    console.log("CHANGE");
    this.user.roles = this.userRoles;
    this.userService.changeRoles(this.user).subscribe(
      (user:User)=>{
        this.users[this.elemIndex] = user;
      }
    );

  }

}
