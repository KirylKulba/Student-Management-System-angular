import { Component, OnInit } from '@angular/core';
import { StudentService } from './student.service';
import { Student } from '../shared/models/student.model';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
