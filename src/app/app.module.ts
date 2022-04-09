
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { MajorsComponent } from './majors/majors.component';
import { AppRoutingModule } from './app-routing.module';
import { MajorsTableComponent } from './majors/majors-table/majors-table.component';
import { MajorsDetailComponent } from './majors/majors-detail/majors-detail.component';
import { FilterPipe } from './shared/filter.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoursesComponent } from './courses/courses.component';
import { StudentsComponent } from './students/students.component';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StudentsDetailComponent } from './students/students-detail/students-detail.component';
import { StudentsTableComponent } from './students/students-table/students-table.component';
import { StudentEditComponent } from './students/student-edit/student-edit.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthComponent } from './auth/auth.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { NotificationsComponent } from './notifications/notifications.component';
import { MajorsEditComponent } from './majors/majors-edit/majors-edit.component';
import { UsersTableComponent } from './users-table/users-table.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MajorsComponent,
    MajorsTableComponent,
    MajorsDetailComponent,
    FilterPipe,
    CoursesComponent,
    StudentsComponent,
    StudentsDetailComponent,
    StudentsTableComponent,
    StudentEditComponent,
    AuthComponent,
    NotificationsComponent,
    MajorsEditComponent,
    UsersTableComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, 
    useClass: AuthInterceptorService, 
    multi:true}
  ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
