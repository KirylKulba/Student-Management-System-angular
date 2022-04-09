import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Student } from 'src/app/shared/models/student.model';
import { StudentService } from '../student.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { serialUnsubscriber, SubscriptionCollection } from 'src/app/shared/utils/subs-collection.interface';
import { CSVRecord } from './csv-record.model';
import { MajorService } from 'src/app/majors/major.service';
import { Major } from 'src/app/shared/models/major.model';
import { User } from 'src/app/auth/user.model';
import { AuthService } from 'src/app/auth/auth.service';
import { StudentBuilder } from 'src/app/shared/builders/student.builder';
import { getUserRole, UserRole } from 'src/app/auth/user-role.enum';

@Component({
  selector: 'app-students-table',
  templateUrl: './students-table.component.html',
  styleUrls: ['./students-table.component.css']
})
export class StudentsTableComponent implements OnInit, OnDestroy {
  
  students:Student[] = [];
  filteredStudent:string = "";

  addManyMode:boolean = false;
  userRoles = [];

  public records: any[] = [];  
  @ViewChild('csvReader') csvReader: any;  

  subscription:Subscription;
  private subscriptions: SubscriptionCollection = {};

  constructor(private router : Router,
              private route  : ActivatedRoute,
              private studentService : StudentService,
              private majorService : MajorService,
              private authService : AuthService) { }

  ngOnInit(): void {

    this.subscriptions['students'] = this.studentService.getStudents().subscribe(
        (students)=>{
            this.students = students;
        }
    );

    this.subscriptions['studentAdded'] = this.studentService.studentAdded.subscribe(
      (newStudent:Student)=>{
        this.students.push(newStudent);
    });

    this.subscriptions['studentDeleted'] = this.studentService.studentDeleted.subscribe(
      (id:number)=>{
        let removeIndex=this.students.map(function(student) {return student.id}).indexOf(id);
        this.students.splice(removeIndex,1);
    });

  }

  changeMode(){
    this.addManyMode = !this.addManyMode;
  }

  onAddNewStudent(){
    this.router.navigate(['newStudent'],{relativeTo:this.route});
  }

  //CSV
  
  uploadListener($event: any): void {  
  
    let files = $event.srcElement.files;  
  
    if (this.isValidCSVFile(files[0])) {  
  
      let input = $event.target;  
      let reader = new FileReader();  
      reader.readAsText(input.files[0]);  
  
      reader.onload = () => {  
        let csvData = reader.result;  
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);  
  
        let headersRow = this.getHeaderArray(csvRecordsArray);  
  
        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length); 
        console.log(this.records); 
      };  
  
      reader.onerror = function () {  
        console.log('error is occured while reading file!');  
      };  
  
    } else {  
      alert("Please import valid .csv file.");  
      this.fileReset();  
    }  
  }  
  
  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {  
    let csvArr = [];  
  
    for (let i = 1; i < csvRecordsArray.length; i++) {  
      let curruntRecord = (<string>csvRecordsArray[i]).split(';');  
      //if (curruntRecord.length == headerLength) {  
        let csvRecord: CSVRecord = new CSVRecord();  
        csvRecord.username = curruntRecord[0].trim();  
        csvRecord.password = curruntRecord[1].trim();  
        csvRecord.email = curruntRecord[2].trim();  
        csvRecord.firstName = curruntRecord[3].trim();  
        csvRecord.lastName = curruntRecord[4].trim(); 
        csvRecord.semester = curruntRecord[5].trim();  
        csvRecord.major = curruntRecord[6].trim();  
        csvArr.push(csvRecord);  
      //}  
    }  
    return csvArr;  
  }  
  
  isValidCSVFile(file: any) {  
    return file.name.endsWith(".csv");  
  }  
  
  getHeaderArray(csvRecordsArr: any) {  
    let headers = (<string>csvRecordsArr[0]).split(',');  
    let headerArray = [];  
    for (let j = 0; j < headers.length; j++) {  
      headerArray.push(headers[j]);  
    }  
    return headerArray;  
  }  
  
  fileReset() {  
    this.csvReader.nativeElement.value = "";  
    this.records = [];  
  } 
  ///CSV

  addUsers(){
    this.subscriptions['majors'] = this.majorService.getMajors().subscribe(
      (majors:Major[])=>{
        this.createStudentsAndUsers(majors);
      }
    );
  }

  private createStudentsAndUsers(majors:Major[]){
    let users:User[] = [];

    for (let i = 0; i < this.records.length; i++) {  
      let major:Major = majors.filter(major => major.name===this.records[i].major)[0];
      
      let newStudent : Student = new StudentBuilder()
        .id(0)
        .firstName(this.records[i].firstName)
        .lastName(this.records[i].lastName)
        .major(major.id)
        .semester(this.records[i].semester)
        .gender('Male')
        .build(); 
        
      this.addUserAndStudent(this.records[i].username, this.records[i].password, 
                        this.records[i].email, newStudent);
      //}  
    } 
  }

  private addUserAndStudent(username:string, password:string, email:string, student:Student){
      let newUserId = 0;
      this.subscriptions['newUser'] = this.authService.signup(
                              username,
                              password,
                              email).subscribe(
                                response => {
                                  newUserId = response.id;
                                  student.userId = newUserId;
                                  this.studentService.addStudent(student);
                                }
                              );
  }

  ngOnDestroy(): void {
    serialUnsubscriber(...Object.values(this.subscriptions));
  } 

}
