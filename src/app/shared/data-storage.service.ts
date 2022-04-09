import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Student } from './models/student.model.js';
import { Observable } from 'rxjs';
import { Course } from './models/course.model.js';
import { StudentCourse } from './StudentCourse/StudentCourse.model.js';
import { Major } from './models/major.model.js';
import { AuthService } from '../auth/auth.service';
import { take } from 'rxjs/operators';
import { User } from '../auth/user.model.js';
import { Role } from '../auth/role.model.js';


@Injectable({
    providedIn: 'root'
})
export class DataStorage{
    
    constructor(private http:HttpClient, private authService:AuthService) {} 

    studentsUrl = 'http://localhost:8080/students/';
    majorsUrl = 'http://localhost:8080/majors/';
    coursesUrl = 'http://localhost:8080/courses/';
    usersUrl = 'http://localhost:8080/users/';
    

    //Students Part
    getStudents():Observable<Student[]>{

        return this.http
            .get<Student[]>(this.studentsUrl,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    getStudent(id:number):Observable<Student>{
        return this.http
            .get<Student>(this.studentsUrl.concat(id.toString()),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    getStudentByUserId(userId:number):Observable<Student>{
        
        return this.http
        .get<Student>(this.usersUrl.concat(userId.toString()).concat('/student'),
        {
            headers : new HttpHeaders ({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Headers': 'Content-Type'
            })
        }
        );
    }

    getStudentCoursesBySemester(studentId:number , semester:number):Observable<StudentCourse[]>{
        return this.http
            .get<StudentCourse[]>(this.studentsUrl.concat(studentId.toString().concat('/courses/')).concat(semester.toString()),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    getStudentAvailableCourses(studentId:number):Observable<Course[]>{
        return this.http
            .get<Course[]>(this.studentsUrl.concat(studentId.toString().concat('/available_courses')),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    updateStudent(student:Student):Observable<Student>{
        return this.http
            .put<Student>(this.studentsUrl,
                student,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    //Majors Part
    getMajors():Observable<Major[]>{
        return this.http
            .get<Major[]>( this.majorsUrl,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }
    

    getMajor(majorId:number):Observable<Major>{
        return this.http
            .get<Major>( this.majorsUrl.concat(majorId.toString()),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    addMajor(major:Major):Observable<Major>{
        return this.http
            .post<Major>( this.majorsUrl,
                    major,
                {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
                }
            );
    }

    
    getMajorCoursesBySemester(majorId:number, semester:number):Observable<Course[]>{
        return this.http
            .get<Course[]>( this.majorsUrl.concat(majorId.toString(),"/semester/",semester.toString(),"/courses"),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    getMajorStudentsBySemester(majorId:number, semester:number):Observable<Student[]>{
        return this.http
            .get<Student[]>( this.majorsUrl.concat(majorId.toString(),"/semester/",semester.toString(),"/students"),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    
    addCourse(newCourse:Course){
        this.http
            .post( this.majorsUrl.concat(newCourse.major.toString(),"/addCourse"),
                    newCourse,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            ).subscribe();
    }

    updateCourse(updatedCourse:Course){
        this.http
            .put( this.coursesUrl,
                updatedCourse,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            ).subscribe();
    }

    deleteCourse(courseId:number){
        this.http
            .delete( this.coursesUrl.concat(courseId.toString()),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                }),responseType: 'text'
            }
            ).subscribe();
    }

    addStudent(newStudent:Student){
        return this.http
            .post( this.studentsUrl,
                    newStudent,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    deleteMajor(id:number){
        return this.http
            .delete(this.majorsUrl.concat(id.toString()),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }),responseType: 'text'
            }
            );
    }

    deleteStudent(id:number){
        return this.http
            .delete(this.studentsUrl.concat(id.toString(),"/deleteStudent"),
          
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }),responseType: 'text'
            }
            );
    }

    addStudentCourse(studentId:number, courseId:number){
        this.http.post(this.studentsUrl.concat(
            studentId.toString(),
            "/add_stdent_course/",
            courseId.toString()),
                        {
                        headers : new HttpHeaders ({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type'
                        })
                }
            ).subscribe();
    }

    updateStudentCourse(scId:number, mark:number){
        this.http.post(this.studentsUrl.concat(
            "updateStudentCourse/",
            scId.toString(),
            "/mark/",
            mark.toString()),
                        {
                        headers : new HttpHeaders ({
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Headers': 'Content-Type'
                        })
                }
            ).subscribe();
    }
    
    disenrollFromCourse(sc_id: number) {
        this.http
            .delete(this.studentsUrl.concat("deleteStudentCourse/",sc_id.toString()),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }),responseType: 'text'
            }
            ).subscribe();
    }

    //USERS
    getUsers():Observable<User[]>{

        return this.http
            .get<User[]>(this.usersUrl,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    getRoles():Observable<Role[]>{

        return this.http
            .get<Role[]>(this.usersUrl.concat("roles"),
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

    changeUserRoles(user:User):Observable<User>{
        console.log("SENDING");
        return this.http
            .post<User>(this.usersUrl.concat("changeRoles"),
            user,
            {
                headers : new HttpHeaders ({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Headers': 'Content-Type'
                })
            }
            );
    }

}