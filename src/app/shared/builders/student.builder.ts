import { Student } from '../models/student.model';

export class StudentBuilder{
    private readonly _student: Student;

    constructor() {
      this._student = Student.getStudentObject();
    }

    id(id: number): StudentBuilder {
        this._student.id = id;
        return this;
    }
  
    firstName(firstName: string): StudentBuilder {
      this._student.firstName = firstName;
      return this;
    }
    
    lastName(lastName: string): StudentBuilder {
      this._student.lastName = lastName;
      return this;
    }

    semester(semester: number): StudentBuilder {
        this._student.semester = semester;
        return this;
    }

    major(major: number): StudentBuilder {
        this._student.major = major;
        return this;
    }

    gender(gender: string): StudentBuilder {
      this._student.gender = gender;
      return this;
    }

    userId(userId: number): StudentBuilder {
      this._student.userId = userId;
      return this;
    }
  
    build(): Student {
      return this._student;
    }
}