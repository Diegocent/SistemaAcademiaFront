import { Component, OnInit } from '@angular/core';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
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
  viewTable: boolean = true;
  
  dataSource: PersonaAlumno[] = []
  displayedColumns: string[] = ['cedula', 'nombre', 'vestuario', 'entrada', 'cantidad_materias', 'derecho_examen', 'accion'];

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
          this.dataSource = [...this.dataSource, temp]
        }
      })
    })
  }

  eliminarAlumno(data, index) {
    Confirm.show(
      'Eliminar alumno/a',
      '¿Está seguro?',
      'Si',
      'No',
      () => {
        this.personaService.delete(data.persona.id)
          .subscribe(response => {
            this.alumnoService.delete(data.alumno.id).subscribe(res => {
              console.log(response);
              let q = [];
              this.dataSource.forEach((e, i) => {
                if(i != index)
                  q = [...q, e]
              })
              this.dataSource = q;
              Report.success(
                'Éxito',
                'Se eliminó al alumno/a exitosamente',
                'Ok',
                );
            })
          })
      },
      () => {},
      {
      },
      );
  }

  modificarAlumno() {
    console.log('modificar alumno')
    this.viewTable = !this.viewTable;
  }
}
