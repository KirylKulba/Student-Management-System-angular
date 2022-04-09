import { Injectable } from '@angular/core';
import { CourseBuilder } from './builders/course.builder';
import { Course } from './models/course.model';
import { DataStorage } from './data-storage.service';
import { Observable } from 'rxjs';
import { CourseJson } from './JsonModels/course.json';
import { StudentCourse } from './StudentCourse/StudentCourse.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  courses: Course[] = [
    new CourseBuilder().id(0)
      .name('Algebra')
      .description('Introduction to geometrical algebra')
      .major(0)
      .semester(1)
      .build(),
    new CourseBuilder().id(1)
      .name('Calculus')
      .description('Introduction to integrals')
      .major(0)
      .semester(1)
      .build()
  ]

  constructor(private dataStorage : DataStorage) {}

  getCourse(id:number){
    return this.courses[id];
  }

  coursesByMajorSemester(major:number,semester:number){
    return this.courses.filter((course)=>{
      return (course.major == major && course.semester == semester)
    }).slice()
  }

  studentCourses( studentId : number , semester:number):Observable<StudentCourse[]>{
    return this.dataStorage.getStudentCoursesBySemester(studentId, semester);
  }

  studentAvailableCourses( studentId : number ):Observable<Course[]>{
    return this.dataStorage.getStudentAvailableCourses(studentId);
  }

  addCourse(course:Course){
    this.dataStorage.addCourse(course);
  }

  updateCourse(updatedCourse:Course){
    this.dataStorage.updateCourse(updatedCourse);
  }

  updateStudentCourse(scId:number, mark:number){
    this.dataStorage.updateStudentCourse(scId, mark);
  }

}
