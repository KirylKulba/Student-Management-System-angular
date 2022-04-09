import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Major } from 'src/app/shared/models/major.model';
import { serialUnsubscriber, SubscriptionCollection } from 'src/app/shared/utils/subs-collection.interface';
import { MajorService } from '../major.service';

@Component({
  selector: 'app-majors-edit',
  templateUrl: './majors-edit.component.html',
  styleUrls: ['./majors-edit.component.css']
})
export class MajorsEditComponent implements OnInit {

  constructor(private majorService:MajorService) { }

  majorForm:FormGroup;

  private subscriptions: SubscriptionCollection = {};

  name:string = "";
  description:string = "";
  semesters:number = 7;

  @Input() editMode:boolean = false;
  @Input() majorId:number;
  @Input() major:Major;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(){

    /*
    if(this.editMode){
      this.subscriptions['student'] = this.studentService.getStudentById(this.id).subscribe(
        (student:Student)=>{
          this.student = student;
          this.firstName = this.student.firstName;
          this.lastName = this.student.lastName;
          this.semester = this.student.semester;
          this.getMajor();
        }
      );
    }else{
      this.createForm(1);
    }*/

    if(this.editMode){
          console.log(this.major);
          this.name = this.major.name;
          this.description = this.major.description;
          this.semesters = this.major.semesters;
          this.createForm();
    }else{
      this.createForm();
    }
  }

  private createForm(){
    this.majorForm=new FormGroup({
      'name':new FormControl(this.name),
      'description':new FormControl(this.description),
      'semesters':new FormControl(this.semesters)
    });
  }

  onSubmitForm(){
    let major : Major;

    if(!this.editMode){
      major = new Major(0,this.majorForm.value['name'],
                        this.majorForm.value['description'],
                        this.majorForm.value['semesters']);
    }else{
      major = new Major(this.majorId,this.majorForm.value['name'],
                        this.majorForm.value['description'],
                        this.majorForm.value['semesters']);
    }

    if(this.editMode){
      this.majorService.updateMajor(major);
    }else{
      this.majorService.addMajor(major);
    }

  }

  ngOnDestroy(): void {
    serialUnsubscriber(...Object.values(this.subscriptions));
  }

}
