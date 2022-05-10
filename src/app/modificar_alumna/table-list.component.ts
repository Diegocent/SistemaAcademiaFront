import { Component, OnInit } from '@angular/core';
import { Alumno, Persona, PersonaAlumno } from 'app/models/models';
import { AlumnoService } from 'app/service/alumno.service';
import { PersonaService } from 'app/service/persona.service';
@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  personas: Persona[] = [];
  alumnos: Alumno[] = [];
  personaAlumno: PersonaAlumno[] = [];

  constructor(private personaService: PersonaService, private alumnoService: AlumnoService) { }

  ngOnInit() {
    this.personaService.getAll()
    .subscribe(res => {
      this.personas = res;
      this.alumnoService.getAll()
      .subscribe(res => {
        this.alumnos = res;
        for(let i = 0; i < this.alumnos.length; i++){
          let temp = {
            persona: this.personas[i],
            alumno: this.alumnos[i]
          }
          this.personaAlumno = [...this.personaAlumno, temp]
        }
      })
    })
  }
}
