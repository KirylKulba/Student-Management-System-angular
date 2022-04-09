import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StudentService } from '../student.service';
import { CourseService } from 'src/app/shared/course.service';
import { Student } from 'src/app/shared/models/student.model';
import { Major } from 'src/app/shared/models/major.model';
import { MajorService } from 'src/app/majors/major.service';
import { StudentDetailMode } from './student-detail.enum';
import { SubscriptionCollection, serialUnsubscriber } from 'src/app/shared/utils/subs-collection.interface';
import { StudentCourse } from 'src/app/shared/StudentCourse/StudentCourse.model';
import { Course } from 'src/app/shared/models/course.model';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { Message, MessageService } from 'src/app/websockets/sockets.service';
import { Subject } from 'rxjs';
import { StudentsTableComponent } from '../students-table/students-table.component';
import { getUserRole, UserRole } from 'src/app/auth/user-role.enum';

@Component({
  selector: 'app-students-detail',
  templateUrl: './students-detail.component.html',
  styleUrls: ['./students-detail.component.css']
})
export class StudentsDetailComponent implements OnInit , OnDestroy{

  private subscriptions: SubscriptionCollection = {};

  student:Student = null;

  studentLoaded = false;

  detailMode : StudentDetailMode = StudentDetailMode.Undefined;

  major:Major;

  selectedMark: number;

  marks = [
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 }
  ]


  id:number;
  semesters:number[];

  messages:Message[] = [];
  studentCourses:StudentCourse[] = [];
  availableCourses:Course[] = [];
  selectedStudentCourse:number;

  loadedSemester:number;
  userRoles = [];

  currentUser:User;

  constructor(private route : ActivatedRoute,
              private router:Router,
              private studentService : StudentService,
              private courseService : CourseService,
              private majorService : MajorService,
              private authService : AuthService,
              private messageService : MessageService) {
                
  }

  ngOnInit(): void {
    this.subscriptions['studentUpdated'] = this.studentService.studentUpdated.subscribe(
      (student:Student)=>{
        this.studentLoaded = false;
        this.student = student; 

        this.getMajor();
    });

    this.subscriptions['currentUser'] = this.authService.user.subscribe(
      (user:User)=>{
        this.currentUser = user;
        if(this.currentUser.roles.some(role => role.name==="STUDENT" || role.name==="ADMIN")){
          
          this.messageService.subscribeForMessages();
        }
        for(var role of user.roles){
          let userRole:UserRole = getUserRole(role.name);
          this.userRoles.push(userRole);
        }
    });

    this.subscriptions['routeParams'] = this.route.params.subscribe(
      (params:Params)=>{
        this.id = +params['id'];
      }
    );

    /*
    this.subscriptions['message'] = this.messageService.incomingMessage.subscribe(
      (message:Message)=>{
        console.log(message);
        this.messages.push(message);
      }
    );*/
    
    this.subscriptions['student'] = this.studentService.getStudentById(this.id).subscribe(
      (student:Student)=>{
        this.setStudent(student);

        this.semesters = [];

        //For select 
        this.getMajor();
      }
    ); 

  }

  ngOnDestroy(): void {
    serialUnsubscriber(...Object.values(this.subscriptions));
  }

  get UserRole(){
    return UserRole;
  }

  setStudent(newStudent:Student){
    this.student = newStudent;
  }

  get StudentDetailMode(){
    return StudentDetailMode;
  }

  onLoadSemesterCurriculum(selected: HTMLInputElement){
    this.detailMode = StudentDetailMode.Curriculum;
    
    this.loadedSemester = +selected.value;
    
    
    if(this.subscriptions['courses']){
      this.subscriptions['courses'].unsubscribe();
    }

    this.subscriptions['courses'] = this.courseService.studentCourses(this.id,this.loadedSemester).subscribe(
      (courses:StudentCourse[])=>{
        this.studentCourses = courses;
      }
    );
    ///CHANGE BY SEMESTER
  }

  onLoadAvailableCourses(selected: HTMLInputElement){
    
    this.detailMode = StudentDetailMode.AvailableCourses;

    if(this.subscriptions['courses']){
      this.subscriptions['courses'].unsubscribe();
    }

    this.subscriptions['courses'] = this.courseService.studentAvailableCourses(this.id).subscribe(
      (courses:Course[])=>{
        this.availableCourses = courses;
      }
    );

  }

  onEditProfile(){
    this.studentCourses = [];
    this.detailMode = StudentDetailMode.EditProfile;

  }

  onDeleteStudent(){
    this.studentService.emitDeletedStudent(this.id);
    this.studentService.deleteStudent(this.id).subscribe(
      ()=>{
        this.navigateToTable();
      }
    );
  }

  private navigateToTable(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onEnrollOnCourse(course:Course){
    this.studentService.enrollOnCourse(this.id, course.id);
    
    let removeIndex=this.availableCourses.map(function(elem) {return elem.id}).indexOf(course.id);
    this.availableCourses.splice(removeIndex,1);


    if(this.currentUser.roles.some(role => role.name==="ADMIN") || 
    this.currentUser.roles.some(role => role.name==="LECTURER") ){
      this.sendMessage(this.student.userId,"You have been enrolled on a new course ".concat(course.name,"."));
    }

  }

  onDisenrollFromCourse(course:StudentCourse){
    let removeIndex = this.studentCourses.findIndex(function(studentCourse){return studentCourse.sc_id === course.sc_id});
    
    this.studentCourses.splice(removeIndex,1);
    this.studentService.disenrollFromCourse(course.sc_id);

    if(this.currentUser.roles.some(role => role.name==="ADMIN") || 
    this.currentUser.roles.some(role => role.name==="LECTURER") ){
      this.sendMessage(this.student.userId,"You have been disenrolled from the course ".concat(course.name,"."));
    }
  }

  onGiveMark(scId:number){
    this.detailMode = StudentDetailMode.Assessment;
    this.selectedStudentCourse = scId;
  }

  onSubmitMark(){
    this.detailMode = StudentDetailMode.Assessment;
    
    this.courseService.updateStudentCourse(this.selectedStudentCourse, this.selectedMark);

    if(this.currentUser.roles.some(role => role.name==="ADMIN") || 
    this.currentUser.roles.some(role => role.name==="LECTURER") ){
      
      let course = this.studentCourses.find(course => course.sc_id === this.selectedStudentCourse);
      
      this.sendMessage(this.student.userId,"You have received a "+this.selectedMark+" for the course ".concat(course.name,".").concat("&",this.selectedStudentCourse.toString(),"&",this.selectedMark.toString(),"&",course.name));
    }

    this.detailMode = StudentDetailMode.Undefined;
  }

  private sendMessage(recipientId:number, content:string){
    this.messageService.sendMessage(recipientId, content);
  }

  private getMajor(){
    this.subscriptions['major'] = this.majorService.getMajor(this.student.major).subscribe(
      (major)=>{
        this.major = major;

        for (let i = 1; i <= this.major.semesters ; i++) {
          this.semesters.push(i);
        }

        this.studentLoaded = true;
      }
    );
  }

}
