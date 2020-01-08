import { Course } from './../model/course';
import {Component, OnInit} from '@angular/core';
import {interval, noop, Observable, of, throwError, timer} from 'rxjs';
import { catchError, delay, delayWhen, finalize, map, retryWhen, shareReplay, tap, filter } from 'rxjs/operators';
import {createHttpObservable} from '../common/util';


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    beginnerCourses$: Observable<Course[]>;

    advancedCourses$: Observable<Course[]>;
  

    ngOnInit() {

                // Call this function every secound
        // const interval1$=interval(1000);
        // interval1$.subscribe(value=>{
        //     console.log(value)
        // })
        //call this function every secound but start after 3 secound
        // const interval$=timer(3000,1000);
        // const sub=interval$.subscribe(value=>{
        //     console.log(value)
        // }) 
        // After 5 secounds sub will be unsubscribe from the observable
        // setTimeout(()=>{sub.unsubscribe()},5000)

        //creating a ajax call for fetching data from server
        //create this function in Common module and import here
        //this is simply a ajax call
        const http$=createHttpObservable('/api/courses')

        //converting into an array so we can use it easily
        //pipe this value and change into array of payload
        //payload value come from server which contains the 
        //Array of the courses so i take object value and 
        //convert into array 
        const courses$:Observable<Course[]>=http$.pipe(
            //tap is a RxJS pipeable operator that returns identical Observable 
            //as source Observable and can be used to perform side effect such 
            //as logging each values emitted by source Observable
            tap(()=>console.log('http Request executed')),
            
            map(res=>Object.values(res["payload"])),
            //shareReplay is a operator which fetch data and send to relevant 
            //users thats why we can control multiple http calls on the same 
            //end point 
            shareReplay()
        )
        //In this case there are two http requests
        //one for beginner courses
        //one for advance course 
        //reason is that in html component we suscribe the data 2 time 
        //thats why 2 http request goes .. 
           this.beginnerCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category == 'BEGINNER'))
            );

            this.advancedCourses$ = courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category == 'ADVANCED'))
            );

        // const http$ = createHttpObservable('/api/courses');

        // const courses$: Observable<Course[]> = http$
        //     .pipe(
        //         tap(() => console.log("HTTP request executed")),
        //         map(res => Object.values(res["payload"]) ),
        //         shareReplay(),
        //         retryWhen(errors =>
        //             errors.pipe(
        //             delayWhen(() => timer(2000)
        //             )
        //         ) )
        //     );

        // this.beginnerCourses$ = courses$
        //     .pipe(
        //         map(courses => courses
        //             .fil   // this.advancedCourses$ = courses$
        //     .pipe(
        //         map(courses => courses
        //             .filter(course => course.category == 'ADVANCED'))
        //     );ter(course => course.category == 'BEGINNER'))
        //     );

     

    }

}
