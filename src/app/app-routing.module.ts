import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MajorsComponent } from './majors/majors.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MajorsTableComponent } from './majors/majors-table/majors-table.component';
import { MajorsDetailComponent } from './majors/majors-detail/majors-detail.component';
import { StudentsComponent } from './students/students.component';
import { StudentsDetailComponent } from './students/students-detail/students-detail.component';
import { StudentsTableComponent } from './students/students-table/students-table.component';
import { StudentEditComponent } from './students/student-edit/student-edit.component';
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { MajorsEditComponent } from "./majors/majors-edit/majors-edit.component";
import { UsersTableComponent } from "./users-table/users-table.component";

const appRoutes:Routes = [
    {path : '' , component : WelcomeComponent ,canActivate:[AuthGuard], pathMatch : 'full'},
    {path : 'majors' , component : MajorsComponent , children : [
        { path : '' , component : MajorsTableComponent } , 
        { path : ':id' , component : MajorsDetailComponent} ,
        { path : 'newMajor' , component : MajorsEditComponent }
    ],canActivate:[AuthGuard]},
    {path : 'students' , component : StudentsComponent , children : [
        { path : '' , component : StudentsTableComponent } , 
        { path : 'newStudent' , component : StudentEditComponent },
        { path : ':id' , component : StudentsDetailComponent}
    ],canActivate:[AuthGuard]},
    {path : 'users' , component : UsersTableComponent, canActivate:[AuthGuard]},
    {path:'auth',component:AuthComponent}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule{

}