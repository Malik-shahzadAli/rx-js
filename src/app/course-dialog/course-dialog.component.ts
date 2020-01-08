import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import {Course} from "../model/course";
import {FormBuilder, Validators, FormGroup} from "@angular/forms";
import * as moment from 'moment';
import {fromEvent} from 'rxjs';
import {concatMap, distinctUntilChanged, exhaustMap, filter, mergeMap} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
    selector: 'course-dialog',
    templateUrl: './course-dialog.component.html',
    styleUrls: ['./course-dialog.component.css']
})
export class CourseDialogComponent implements OnInit, AfterViewInit {

    form: FormGroup;

    course:Course;

    @ViewChild('saveButton', { static: true }) saveButton: ElementRef;

    @ViewChild('searchInput', { static: true }) searchInput : ElementRef;

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<CourseDialogComponent>,
        @Inject(MAT_DIALOG_DATA) course:Course ) {

        this.course = course;

        this.form = fb.group({
            description: [course.description, Validators.required],
            category: [course.category, Validators.required],
            releasedAt: [moment(), Validators.required],
            longDescription: [course.longDescription,Validators.required]
        });

    }

    ngOnInit() {
        //this function call when user change values from the FORM
        this.form.valueChanges
            .pipe(
                //filter the form values and check if enterd value is valid or not
                filter(() => this.form.valid),
                //concatMap ensure that one observer request complete 
                //after the completion of one observer request it call 
                //the next observer call same like the concat operator
                concatMap(changes => this.saveCourse(changes))
            )
            .subscribe();


    }


    saveCourse(changes) {
        return fromPromise(fetch(`/api/courses/${this.course.id}`,{
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }


    ngAfterViewInit() {

        fromEvent(this.saveButton.nativeElement, 'click')
            .pipe(
                //we use exhaustMap parameter becuase user can 
                //click multiple time on the save button in this case
                //our observer request goes multiple time 
                //and our app will be slow
                //that's why we use exhaustMap becuause exhaustMap
                //will ignore all other observer request while one observer 
                //request is in process
                exhaustMap(() => this.saveCourse(this.form.value))
            )
            .subscribe();

    }



    close() {
        this.dialogRef.close();
    }


}
