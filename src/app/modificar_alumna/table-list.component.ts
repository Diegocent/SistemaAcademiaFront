import { Component, EventEmitter, OnInit, Output ,ViewChild} from '@angular/core';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { Alumno, Persona, PersonaAlumno } from 'app/models/models';
import { AlumnoService } from 'app/service/alumno.service';
import { PersonaService } from 'app/service/persona.service';
import { MontoConceptoService } from 'app/service/monto_concepto.service';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {
  // @Output() eventopersona =new EventEmitter<Alumno>;
  
  personas: Persona[] = [];
  alumnos: Alumno[] = [];
  // personaAlumno: PersonaAlumno[] = [];
  viewTable: boolean = true;

  //PARA ENVIAR A MODIFICAR
  personaModificar: Persona;
  alumnoModificar: Alumno;
  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  auxiliar:any=[];
  displayedColumns: string[] = ['cedula', 'nombre', 'curso', 'vestuario', 'entrada', 'cantidad_materias', 'derecho_examen', 'cuota', 'accion'];

  constructor(
    private personaService: PersonaService,
    private alumnoService: AlumnoService, 
    private montoConceptoService: MontoConceptoService) { }

  ngOnInit() {
    this.actualizar();
  }

  actualizar(){
    this.personaService.getAll()
    .subscribe(res => {
      this.personas = res;
      console.log(res);
      this.alumnoService.getAll()
      .subscribe(res => {
        this.alumnos = res;
        console.log(res);
        for(let i = 0; i < this.alumnos.length; i++){
          console.log("alumno", this.alumnos[i])
          this.montoConceptoService.get(this.alumnos[i].sa_curso.cuota).subscribe(ans => {
            let cuota = ans;
            this.montoConceptoService.get(this.alumnos[i].sa_curso.examen).subscribe(re => {
              let examen = re;
              let temp = {
                persona: this.personas[i],
                alumno: this.alumnos[i],
                cuota: cuota,
                examen: examen,
                curso: this.alumnos[i].sa_curso.nombre
              }
            console.log(temp);
            this.auxiliar = [...this.auxiliar, temp]
            this.auxiliar.sort((a, b) => a.persona.nombre.localeCompare(b.persona.nombre));
            this.dataSource = new MatTableDataSource<PersonaAlumno>(this.auxiliar);
            this.dataSource.paginator = this.paginator;
            console.log(this.dataSource);
            })
          });
        }
      });
    });
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
              this.auxiliar=[];
              this.actualizar();
              // let q = [];
              // this.dataSource.forEach((e, i) => {
              //   if(i != index)
              //     q = [...q, e]
              // })
              // this.dataSource = q;
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

  modificarAlumno(data) {
    // Report.warning(
    //   'En Construcción',
    //   'Esta funcionalidad se encuentra en proceso de desarrollo.',
    //   'Ok',
    //   );
    // console.log(data.persona)
    this.personaModificar = data.persona;
    this.alumnoModificar = data.alumno;
    // console.log('dataPersonaAlumno', this.data)
    this.viewTable = !this.viewTable;
  }
}
