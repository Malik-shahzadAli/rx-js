import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {concat, fromEvent, interval, noop, observable, Observable, of, timer, merge} from 'rxjs';
import {delayWhen, filter, map, take, timeout} from 'rxjs/operators';
import { createHttpObservable } from '../common/util'


@Component({
    selector: 'about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

    ngOnInit() {
        //For Sequential Observable calls we use concat operator 
        // -------------(a)----(b)-----Complete-->
        //                                     ------------------(c)----(d)-----Complete-->
        //--------------------------------------------------
        //             CONCAT                         
        //--------------------------------------------------
        //---------------(a)----(b)--------------(c)-----(d)---------------Complete-->

        //of is a observer
        // const source1$=of(1,2,3);
        // const source2$=of(4,5,6);
        // const source3$=of(7,8,9);
        // const result$=concat(source1$,source2$,source3$);
        // result$.subscribe(val=>console.log(val))

   }
}







