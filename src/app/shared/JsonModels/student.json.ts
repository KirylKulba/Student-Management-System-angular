import { GenderJson } from './GenderJson.json';
import { MajorJson } from './MajorJson.json.js';
import { StudentBuilder } from '../builders/student.builder.js';
import { Student } from '../models/student.model.js';

export class StudentJson{

    constructor(public firstName:string, public lastName:string, 
                public id:number, public gender:GenderJson, 
                public major:MajorJson, public semester:number){}

    toStudent():Student{
        let studentBuilder:StudentBuilder = new StudentBuilder();
        return studentBuilder
            .id(this.id)
            .firstName(this.firstName)
            .lastName(this.lastName)
            .major(this.major.id)
            .semester(this.semester)
            .build();
    }
}