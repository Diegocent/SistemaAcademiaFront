import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PersonaService } from 'app/service/persona.service';
import { Conceptos } from 'app/config/app-settings';
import { AlumnoService } from 'app/service/alumno.service';
import { Alumno, Persona } from 'app/models/models';
import { MontoConceptoService } from 'app/service/monto_concepto.service';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})

export class TypographyComponent {

  formularioCobro = new FormGroup({
    cedula: new FormControl(''),
    tipoPago: new FormControl(''),
    importe: new FormControl(''),
  })

  conceptos: string[] = [];
  persona: Persona;
  alumnos: Alumno[] =[];
  alumno: Alumno;
  tipoPago: string;

  nombre: String = '';

  constructor(private personaService: PersonaService,
    private alumnoService: AlumnoService, 
    private montoConceptoService: MontoConceptoService ) {
    Object.values(Conceptos).forEach(concepto => {
      this.conceptos = [...this.conceptos, concepto]
    });

    this.alumnoService.getAll().subscribe(response => {
      this.alumnos = response;
      console.log(this.alumnos)
    })
  }

  guardarCobro() {
    console.log(this.formularioCobro.value);
    this.limpiarFormulario()
  }

  cedulaChange(event) {
    this.personaService.getPersona(event.target.value)
      .subscribe(response => {
        this.persona = response;
        this.nombre = this.persona.nombre + ' ' + this.persona.apellido;
        console.log(response)
        this.alumnos.forEach(alumno => {
          if (alumno.sa_persona.id === this.persona.id) {
            this.alumno = alumno;
          }
        })
        console.log(this.alumnos)
        this.formularioCobro.patchValue({'importe': ''})
        // this.conceptoChange(null);
      })
  }

  conceptoChange(concepto) {
    // console.log("disparado")
    this.tipoPago = concepto.value;
    if (this.tipoPago === 'Cuota') {
      this.montoConceptoService.get(this.alumno.sa_curso.cuota).subscribe(res => {
        let importe = res.monto;
        this.formularioCobro.patchValue({'importe': importe})
      })
    } else if (this.tipoPago == 'Vestuario') {
        this.formularioCobro.patchValue({'importe': this.alumno.vestuario})
    } else if (this.tipoPago == 'Entrada') {
      this.formularioCobro.patchValue({'importe': this.alumno.entrada})
    } else if (this.tipoPago == 'Derecho a examen') {
      this.montoConceptoService.get(this.alumno.sa_curso.examen).subscribe(res => {
        let importe = null;
        if (this.alumno.sa_curso.nombre === 'Pre-Ballet' || this.alumno.sa_curso.nombre === 'Preparatorio') {
          importe = 150000;
        } else {
          importe = res.monto * this.alumno.cantidad_materias;
        }
        this.formularioCobro.patchValue({'importe': importe})
      })
    }
  }

  limpiarFormulario() {
    this.formularioCobro.reset();
    this.nombre = ''
  }
}
