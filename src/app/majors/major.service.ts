import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { DataStorage } from '../shared/data-storage.service';
import { Major } from '../shared/models/major.model';

@Injectable({
  providedIn: 'root'
})
export class MajorService {

  majorAdded = new Subject<boolean>(); 
  majorDeleted = new Subject<number>(); 
  majorUpdated = new Subject<Major>();
  
  constructor(private dataStorage:DataStorage) { }

  getMajors(){
    return this.dataStorage.getMajors();
  }

  getMajor(id:number){
    return this.dataStorage.getMajor(id);
  }

  getMajorCoursesBySemester(id:number , semester:number){
    return this.dataStorage.getMajorCoursesBySemester(id, semester);
  }

  getMajorStudentsBySemester(id:number , semester:number){
    return this.dataStorage.getMajorStudentsBySemester(id,semester);
  }

  addMajor(major:Major){
    return this.dataStorage.addMajor(major).subscribe(
      ()=>{
        this.majorAdded.next(true);
      }
    );
  }

  updateMajor(major:Major){
    return this.dataStorage.addMajor(major).subscribe(
      (major:Major)=>{
        this.majorUpdated.next(major);
      }
    );
  }

  deleteMajor(majorId: number) {
    return this.dataStorage.deleteMajor(majorId);
  }

  emitDeletedMajor(id:number){
    this.majorDeleted.next(id);
  }

  deleteCourse(courseId: number) {
    this.dataStorage.deleteCourse(courseId);
  }

}
