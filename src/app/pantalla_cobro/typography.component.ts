import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PersonaService } from 'app/service/persona.service';
import { Conceptos } from 'app/config/app-settings';

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
    tipoPago: new FormControl(''),
    importe: new FormControl(''),
  })

  conceptos: string[] = [];

  nombre: String = '';

  constructor(private personaService: PersonaService) {
    Object.values(Conceptos).forEach(concepto => {
      this.conceptos = [...this.conceptos, concepto]
    });
  }

  guardarCobro() {
    console.log(this.formularioCobro.value);
  }

  cedulaChange(event) {
    this.personaService.getPersona(event.target.value)
      .subscribe(response => {
        this.nombre = response.nombre + ' ' + response.apellido;
      })
  }
}
