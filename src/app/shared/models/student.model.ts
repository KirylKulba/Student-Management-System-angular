
export class Student{

    constructor(
        public id:number,
        public firstName:string,
        public lastName:string,
        public semester:number,
        public major:number,
        public gender:string,
        public userId:number){}

    public static getStudentObject():Student{
        return new Student(null,null,null,null,null,null,null);
    }

}