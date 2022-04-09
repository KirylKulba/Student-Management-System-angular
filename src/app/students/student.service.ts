import { Injectable } from '@angular/core';
import { Student } from '../shared/models/student.model';
import { Subject } from 'rxjs';
import { DataStorage } from '../shared/data-storage.service';

@Injectable({
    providedIn: 'root'
})
export class StudentService {
    
    studentUpdated = new Subject<Student>(); 
    studentAdded = new Subject<Student>(); 
    studentDeleted = new Subject<number>();
     

    constructor(private dataStorage:DataStorage){}

    students:Student[] = [];

    getStudents(){
        return this.dataStorage.getStudents();
    }

    getStudentById(id : number){
        return this.dataStorage.getStudent(id);
    }

    getStudentByUserId(userId : number){
        return this.dataStorage.getStudentByUserId(userId);
    }

    studentsByMajorSemester(major:number,semester:number){
        return this.students.filter((student)=>{
          return (student.major == major && student.semester == semester)
        }).slice()
    }

    addStudent(student:Student){
        let newStudent = this.dataStorage.addStudent(student);
        newStudent.subscribe(
            (student_:Student)=>{
                this.studentAdded.next(student_);
            }
        );
    }

    updateStudent(student:Student){
        let updatedStudent = this.dataStorage.updateStudent(student);
        updatedStudent.subscribe(
            (student:Student)=>{
                this.studentUpdated.next(student);
            }
        );
    }

    deleteStudent(id:number){
        return this.dataStorage.deleteStudent(id);
    }

    emitDeletedStudent(id:number){
        this.studentDeleted.next(id);
    }

    enrollOnCourse(studentId:number, courseId:number){
        this.dataStorage.addStudentCourse(studentId, courseId);
    }

    disenrollFromCourse(sc_id: number) {
        this.dataStorage.disenrollFromCourse(sc_id);
      }

}