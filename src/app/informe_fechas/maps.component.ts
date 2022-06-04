import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter} from '@angular/material/core';
import { Report } from 'notiflix/build/notiflix-report-aio';


export const DateFormat = {
  parse: {
  dateInput: 'input',
  },
 display: {
 dateInput: 'MM/DD/YYYY',
 monthYearLabel: 'MMMM YYYY',
 dateA11yLabel: 'MM/DD/YYYY',
 monthYearA11yLabel: 'MMMM YYYY',
 }
 };

 export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
];

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.css'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat }
   ]
})
export class MapsComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
  constructor() { 
    Report.warning(
      'En Construcción',
      'Esta funcionalidad se encuentra en proceso de desarrollo.',
      'Ok',
      );
  }

}
