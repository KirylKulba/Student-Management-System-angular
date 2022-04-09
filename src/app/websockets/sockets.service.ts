import { Injectable, OnDestroy } from "@angular/core";
import * as Stomp from 'stompjs';

import { AuthResponse, AuthService } from "../auth/auth.service";
import { BehaviorSubject, Subject, Subscription } from "rxjs";

import { HttpClient, HttpHeaders } from "@angular/common/http";
import * as SockJS from "sockjs-client";
import { DataStorage } from "../shared/data-storage.service";

export interface Message{
  senderId: number,
  recipientId: number,
  senderName: string,
  content: string,
  mark?:number,
  scId?:number,
  course?:string
}


@Injectable({providedIn:'root'})
export class MessageService implements OnDestroy{

    currentUser:AuthResponse;
    userSubscription:Subscription;

    authUrl = 'http://localhost:8080/users/';


    constructor(private authService:AuthService, private http:HttpClient,
                private dataStorage:DataStorage) {}
    
      public stompClient = null;


    incomingMessage = new Subject<Message>();


      initializeWebSocketConnection(user:AuthResponse) {
        //Getting user's data
        this.currentUser = user;

            //Initialize WebSocket Connection
            const serverUrl = 'http://localhost:8080/ws?Bearer='.concat(user._token);
            const ws = new SockJS(serverUrl);
            this.stompClient = Stomp.over(ws);
            this.stompClient.connect({},this.onConnected,this.onError);

      }

      onError = (err) => {
        console.log(err);
      };

      onConnected(){
        console.log("Connected");
      }

      subscribeForMessages(){
        this.stompClient.subscribe(
          "/user/"+this.currentUser.id+"/queue/messages",
          message => {
                try {
                  let newMessage:Message = JSON.parse(message.body); 
                  this.incomingMessage.next(newMessage);

              } catch (e) {
                  console.log("Cannot parse data : " + e);
              }
          }
        );
      }
      
      sendMessage(recipientId:number, content:string) {

        const message = {
            senderId: this.currentUser.id,
            recipientId: recipientId,
            senderName: this.currentUser.username,
            content: content
        }
        this.stompClient.send('/app/chat' , {}, JSON.stringify(message));
      }

      ngOnDestroy(): void {
            this.userSubscription.unsubscribe();
        }

}