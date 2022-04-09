import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { MajorService } from '../major.service';
import { Major } from 'src/app/shared/models/major.model';

import { MdbTablePaginationComponent, MdbTableDirective } from 'angular-bootstrap-md';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { serialUnsubscriber, SubscriptionCollection } from 'src/app/shared/utils/subs-collection.interface';

@Component({
  selector: 'app-majors-table',
  templateUrl: './majors-table.component.html',
  styleUrls: ['./majors-table.component.css']
})
export class MajorsTableComponent implements OnInit,OnDestroy{

  subscription:Subscription;
  majors:Major[] = [];
  addMajor:boolean = false;
  private subscriptions: SubscriptionCollection = {};

  filteredMajor='';


  constructor(private majorService:MajorService,
              private route  : ActivatedRoute,
              private router : Router) {}

          
  onMajorForm(){
    this.addMajor = !this.addMajor;
  }
      

  ngOnInit(): void {

    this.loadMajors();

    this.subscriptions['majorAdded'] = this.majorService.majorAdded.subscribe(
      (bool:boolean)=>{
          this.loadMajors();
      }
    );

    this.subscriptions['majorDeleted'] = this.majorService.majorDeleted.subscribe(
      (id:number)=>{
        let removeIndex=this.majors.map(function(major) {return major.id}).indexOf(id);
        this.majors.splice(removeIndex,1);
    });

  }

  private loadMajors(){
    this.subscriptions['majors'] = this.majorService.getMajors().subscribe(
      (majors)=>{
          this.majors = majors;
      }
    );
  }

  onAddNewMajor(){
    this.router.navigate(['newMajor'],{relativeTo:this.route});
  }

  ngOnDestroy(): void {
    serialUnsubscriber(...Object.values(this.subscriptions));
  }

  ngAfterViewInit(): void {
  }

}
