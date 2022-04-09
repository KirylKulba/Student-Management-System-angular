import { Course } from '../models/course.model';


export class CourseBuilder{
    private readonly _course: Course;

    constructor() {
      this._course = new Course();
    }

    id(id: number): CourseBuilder {
        this._course.id = id;
        return this;
    }
  
    name(name: string): CourseBuilder {
      this._course.name = name;
      return this;
    }
    
    description(description: string): CourseBuilder {
      //this._course.description = description;
      return this;
    }

    semester(semester: number): CourseBuilder {
        this._course.semester = semester;
        return this;
    }

    major(major: number): CourseBuilder {
        this._course.major = major;
        return this;
    }
  
    build(): Course {
      return this._course;
    }
}