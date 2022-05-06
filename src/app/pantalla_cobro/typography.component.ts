import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PersonaService } from 'app/service/persona.service';

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
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})

export class TypographyComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;

  formularioCobro = new FormGroup({
    cedula: new FormControl(''),
    nombre: new FormControl(''),
    tipoPago: new FormControl(''),
    importe: new FormControl(''),
  })

  nombre: String = '';

  constructor(private personaService: PersonaService) { }

  guardarCobro() {
    console.log(this.formularioCobro.value);
  }

  cedulaChange(event) {
    let x = event.target.value;
    console.log(x);
    // console.log(this.personaService.checkPersona(event.target.value))
    // console.log(event.target.value);
  }
}
