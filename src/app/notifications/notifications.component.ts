import { Component, OnDestroy, OnInit } from '@angular/core';
import { Notification, Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { getUserRole, UserRole } from '../auth/user-role.enum';
import { User } from '../auth/user.model';
import { CourseService } from '../shared/course.service';
import { Message, MessageService } from '../websockets/sockets.service';


@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit,OnDestroy {

  userRoles = [];
  currentUser:User;

  userSub:Subscription;
  notificationSubscription:Subscription;
  notifications:Message[] = [];
  lastIndex:number=-1;

  ifDisagree:boolean = false;

  marks = [
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 }
  ]

  selectedMark: number;
  selectedNotification:Message;
  message:String;
  notificationIndex:number;

  constructor(private messageService:MessageService,
              private authService:AuthService,
              private courseService : CourseService) { }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      (user:User)=>{
        this.currentUser = user;
        for(var role of user.roles){
          let userRole:UserRole = getUserRole(role.name);
          this.userRoles.push(userRole);
        }
    });
    this.notificationSubscription = this.messageService.incomingMessage.subscribe(
      (notification:Message)=>{
        this.addNotification(notification);
      }
    );
  }

  private addNotification(notification:Message){
    if(this.notifications.length === 0){

      if(this.currentUser.roles.some(role => role.name==="ADMIN" || role.name==="STUDENT")){
        if(notification.content.includes('&')){
          let subStrings:string[] = notification.content.split('&');
          notification.content = subStrings[0];
          notification.scId = parseInt(subStrings[1]);
          notification.mark = parseInt(subStrings[2]);
          notification.course = subStrings[3];
        }
      }

      this.notifications.push(notification);
    }else{
      let lastItem:Message = this.notifications[this.notifications.length - 1];

      if(!this.isNotificationEqual(lastItem,notification)){
        this.notifications.push(notification);
      }
    }
  }

  onRemoveNotification(index:number){
    this.notifications.splice(index,1);
  }

  markProposition(senderId:number){
    this.messageService.sendMessage(senderId,"Message : "+this.message+"."+"Mark proposition : "+this.selectedMark+" for the course "+this.selectedNotification.course+
    "&"+this.selectedNotification.scId+"&"+this.selectedMark+"&"+this.selectedNotification.course);
    this.ifDisagree = false;
    this.selectedMark = 0;
    this.message = "";
    this.notifications.splice(this.notificationIndex,1);
  }

  //FEEDBACK oN PROPOSITION
  agreeMark(notification:Message, index:number){
    this.messageService.sendMessage(notification.senderId,"POSITIVE Mark proposition : "+notification.mark+" for the course "+notification.course);
    this.courseService.updateStudentCourse(notification.scId, notification.mark);
    this.notifications.splice(index,1);
  }

  disagreeMark(notification:Message, index:number){
    this.messageService.sendMessage(notification.senderId,"NEGATIVE for the mark proposition : "+notification.mark+" for the course "+notification.course);
    this.notifications.splice(index,1);
  }

  onDisagree(notification:Message,index:number){
    this.selectedNotification = notification;
    this.ifDisagree = true;
    this.notificationIndex = index;
  }

  get UserRole(){
    return UserRole;
  }

  private isNotificationEqual(notificationFirst:Message, notificationSecond:Message) {
    if(notificationFirst.content === notificationSecond.content){
      if(notificationFirst.recipientId === notificationSecond.recipientId){
        if(notificationFirst.senderId === notificationSecond.senderId){
          if(notificationFirst.senderName === notificationSecond.senderName){
            return true;
          }
        }
      }
    }
    return false;
  }

}
