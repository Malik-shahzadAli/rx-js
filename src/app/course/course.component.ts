import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Course} from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat} from 'rxjs';
import {Lesson} from '../model/lesson';
import {createHttpObservable} from '../common/util';
import {debug, RxJsLoggingLevel, setRxJsLoggingLevel} from '../common/debug';


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    courseId:string;

    course$ : Observable<Course>;

    lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute) {


    }

    ngOnInit() {
        //getting course id from the Query params when user click on the course 
        //course id goes into the Url as Query param
        this.courseId = this.route.snapshot.params['id'];

        //fetching course 
        this.course$ = createHttpObservable(`/api/courses/${this.courseId}`)
            .pipe(
                debug( RxJsLoggingLevel.INFO, "course value "),
            );

        setRxJsLoggingLevel(RxJsLoggingLevel.TRACE);

    }

    ngAfterViewInit() {

        this.lessons$ = fromEvent<any>(this.input.nativeElement, 'keyup')
            .pipe(
                map(event => event.target.value),
                startWith(''),
                debug( RxJsLoggingLevel.TRACE, "search "),
                //debounceTime is a function will takes a value
                //wait for that value if new value come in this 
                //given time old value will be cancled and new value
                //used 
                debounceTime(400),
                distinctUntilChanged(),
                //switchMap will Cancle old observer request if 
                //new observer request comes for example in search
                //user press a key and a ajax call go but user press
                //new key old ajax call will be cancle
                switchMap(search => this.loadLessons(search)),
                debug( RxJsLoggingLevel.DEBUG, "lessons value ")
            );

    }

    loadLessons(search = ''): Observable<Lesson[]> {
        return createHttpObservable(
            `/api/lessons?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(res => res["payload"])
            );
    }


}











