export enum UserRole{
    Student="STUDENT",
    Lecturer="LECTURER",
    Admin="ADMIN",
    Undefined="UNDEFINED"
}
export function getUserRole(userRole:string){
    switch(userRole) { 
        case UserRole.Student: { 
           return UserRole.Student;
           break; 
        } 
        case UserRole.Admin: { 
            return UserRole.Admin;
           break; 
        } 
        case UserRole.Lecturer: { 
            return UserRole.Lecturer;
           break; 
        } 
     } 
}