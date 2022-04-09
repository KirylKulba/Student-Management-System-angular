import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MajorService } from '../major.service';
import { CourseService } from 'src/app/shared/course.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CourseBuilder } from 'src/app/shared/builders/course.builder';
import { Major } from 'src/app/shared/models/major.model';
import { Course } from 'src/app/shared/models/course.model';
import { MajorDetailMode } from './major-detail.enum';
import { StudentService } from 'src/app/students/student.service';
import { Student } from 'src/app/shared/models/student.model';
import { SubscriptionCollection, serialUnsubscriber } from 'src/app/shared/utils/subs-collection.interface';

@Component({
  selector: 'app-majors-detail',
  templateUrl: './majors-detail.component.html',
  styleUrls: ['./majors-detail.component.css']
})
export class MajorsDetailComponent implements OnInit, OnDestroy {

  major:Major;
  id:number;
  semesters:number[];
  courses:Course[] = [];
  students:Student[] = [];
  loadedSemester:number;
  updatedCourse:Course;

  majorLoaded:boolean = false;

  private subscriptions: SubscriptionCollection = {};

  detailMode : MajorDetailMode = this.MajorDetailMode.Undefined;

  newCourseForm: FormGroup;

  constructor(private route : ActivatedRoute,
              private majorService : MajorService,
              private courseService : CourseService,
              private studentService : StudentService,
              private router : Router) {
  }

  ngOnInit(): void {
    this.subscriptions['route'] = this.route.params.subscribe(
      (params:Params)=>{
        this.id = +params['id'];

        this.getMajor();
      }
    );
    this.subscriptions['updatedMajor'] = this.majorService.majorUpdated.subscribe(
      (major:Major)=>{
        this.getMajor();
        //this.majorLoaded = false;
      }
    );
  }

  onDeleteMajor(){
    this.majorService.emitDeletedMajor(this.id);
    this.majorService.deleteMajor(this.id).subscribe(
      ()=>{
        this.navigateToTable();
      }
    );
  }

  onEditMajor(){
    this.detailMode = MajorDetailMode.EditMajor;
  }

  private navigateToTable(){
    this.router.navigate(['../'],{relativeTo:this.route});
  }

  public get MajorDetailMode() {
    return MajorDetailMode; 
  }

  onLoadCourses(selected: HTMLInputElement){
    this.detailMode = MajorDetailMode.ShowCourses;
    this.loadedSemester = +selected.value;
    this.getCourses();
  }

  onLoadStudents(selected: HTMLInputElement){
    this.detailMode = MajorDetailMode.ShowStudents;

    this.loadedSemester = +selected.value;
    this.getStudents();
  }

  onAddNewCourse(){
    this.detailMode = MajorDetailMode.AddCourse;
    this.onLoadCourseForm(null);
  }

  onEditCourse(course:Course){
    this.detailMode = MajorDetailMode.EditCourse;
    this.updatedCourse = course;
    this.onLoadCourseForm(course);
  }

  onLoadCourseForm(course:Course){
    let courseName:string=null;
    if(this.detailMode == MajorDetailMode.EditCourse){
      courseName = course.name;
    }
    this.newCourseForm = new FormGroup({
      'courseName':new FormControl(courseName, Validators.required)
    });
  }

  onAddCourse(selected: HTMLInputElement){
    this.loadedSemester = +selected.value;
    let course:Course = new CourseBuilder()
      .id(0)
      .name(this.newCourseForm.get('courseName').value)
      .major(this.major.id)
      .semester(this.loadedSemester)
      .build();
    this.courseService.addCourse(course);
    this.detailMode = MajorDetailMode.Undefined;
  }

  onSubmitCourseChanges(selected: HTMLInputElement){
    this.loadedSemester = +selected.value;

    this.updatedCourse.name = this.newCourseForm.get('courseName').value;
    this.updatedCourse.semester = this.loadedSemester;

    this.courseService.updateCourse(this.updatedCourse);
    this.updatedCourse = null;
    this.detailMode = MajorDetailMode.Undefined;
  }

  onDeleteCourse(courseId:number){
    this.majorService.deleteCourse(courseId);
      
    let removeIndex=this.courses.map(function(course) {return course.id}).indexOf(courseId);
    this.courses.splice(removeIndex,1);
    
  }

  private getMajor(){
    this.subscriptions['major'] = this.majorService.getMajor(this.id).subscribe(
      (major)=>{
        this.major = major;

        this.semesters = [];
        for (let i = 1; i <= this.major.semesters ; i++) {
          this.semesters.push(i);
        }
        this.majorLoaded = true;

      }
    );
  }

  private getCourses(){
    this.subscriptions['courses'] = this.majorService.getMajorCoursesBySemester(this.id, this.loadedSemester).subscribe(
      (courses)=>{
        this.courses = courses;
      }
    );
  }

  private getStudents(){
    this.subscriptions['students'] = this.majorService.getMajorStudentsBySemester(this.id, this.loadedSemester).subscribe(
      (students)=>{
        this.students = students;
      }
    );
  }

  ngOnDestroy(): void {
    serialUnsubscriber(...Object.values(this.subscriptions));
  }

}
