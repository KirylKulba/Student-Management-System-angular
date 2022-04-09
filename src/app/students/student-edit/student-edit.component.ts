import { Component, OnInit, Input,  OnDestroy } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StudentService } from '../student.service';
import { Major } from 'src/app/shared/models/major.model';
import { MajorService } from 'src/app/majors/major.service';
import { Student } from 'src/app/shared/models/student.model';
import { StudentBuilder } from 'src/app/shared/builders/student.builder';
import { SubscriptionCollection, serialUnsubscriber } from 'src/app/shared/utils/subs-collection.interface';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';

@Component({
  selector: 'app-student-edit',
  templateUrl: './student-edit.component.html',
  styleUrls: ['./student-edit.component.css']
})
export class StudentEditComponent implements OnInit, OnDestroy {


  firstName='';
  lastName='';
  gender='';
  username='';
  password='';
  email='';
  semester:number = 1;

  @Input() id:number;
  @Input() editMode=false;

  private subscriptions: SubscriptionCollection = {};
  @Input() student:Student;

  studentForm:FormGroup;
  studentLoaded:boolean = false;
  majorAndSemesterLoaded:boolean = false;

  semesters:number[] = [];
  majors:Major[];

  value:number;
  
  major:Major;

  constructor(private route:ActivatedRoute,
              private router:Router,
              private studentService:StudentService,
              private majorService:MajorService,
              private authService:AuthService) {}

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(){
    this.getMajors();
    if(this.editMode){
      this.id = this.student.id;
      this.firstName = this.student.firstName;
      this.lastName = this.student.lastName;
      this.semester = this.student.semester;
      this.getMajor();
    }else{
      this.createForm(1);
    }

  }

  onSubmitForm(){
    const newStudent : Student = new StudentBuilder()
      .id(this.id)
      .firstName(this.studentForm.value['firstName'])
      .lastName(this.studentForm.value['lastName'])
      .major(this.studentForm.value['major'])
      .semester(this.studentForm.value['semester'])
      .gender('Male')
      .build();
    
    if(this.editMode == true){
      newStudent.userId = this.student.userId;
      this.studentService.updateStudent(newStudent);
    }else{
      this.studentService.studentAdded.next(newStudent);
      let newUserId = 0;
      this.subscriptions['newUser'] = this.authService.signup(this.studentForm.value['username'],
                              this.studentForm.value['password'],
                              this.studentForm.value['email']).subscribe(
                                response => {
                                  newUserId = response.id;
                                  newStudent.id = 0;
                                  newStudent.userId = newUserId;
                                  this.studentService.addStudent(newStudent);
                                  this.onCancel();
                                }
                              );
    }
  }

  onCancel(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  onChange(index){
    this.value = index;
  }

  private getMajor(){
    this.subscriptions['major'] = this.majorService.getMajor(this.student.major).subscribe(
      (major)=>{
        this.major = major;
        
        this.createForm(this.major.id);

        this.studentLoaded = true;
      }
    );
  }

  private createForm(majorId:number){
    if(this.editMode){
      this.studentForm=new FormGroup({
        'firstName':new FormControl(this.firstName),
        'lastName':new FormControl(this.lastName),
        'semester':new FormControl(this.semester),
        'major':new FormControl(majorId)
      });
    }else{
      this.studentForm=new FormGroup({
        'firstName':new FormControl(this.firstName),
        'lastName':new FormControl(this.lastName),
        'semester':new FormControl(this.semester),
        'major':new FormControl(majorId),
        'username':new FormControl(this.username),
        'password':new FormControl(this.password),
        'email':new FormControl(this.email)
      });
    }
  }

  private getMajors(){
    this.subscriptions['majors'] = this.majorService.getMajors().subscribe(
      (majors)=>{
        this.majors = majors;

      for (let i = 1; i <= this.majors[0].semesters ; i++) {
        this.semesters.push(i);
      }

      this.majorAndSemesterLoaded = true;

      }
    );
  }

  ngOnDestroy(): void {
    serialUnsubscriber(...Object.values(this.subscriptions));
  }

}
