import { Component, OnInit, Input } from '@angular/core';
import { Station } from './station';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})

export class StationComponent implements OnInit {
    
    @Input() station: Station;

    constructor() { }

    ngOnInit(): void {
    }
}
