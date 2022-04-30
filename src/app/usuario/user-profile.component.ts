import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  
  nombre:string;
  apellido:string;
  numerocedula:string;
  vestuario:number;
  entrada:number;
  cantidadmaterias:number;
  derechoexamen:number;
  curso:string;


  constructor() { }

  ngOnInit() {
  }

  

}
