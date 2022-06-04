import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { PersonaService } from 'app/service/persona.service';
import { Conceptos } from 'app/config/app-settings';
import { AlumnoService } from 'app/service/alumno.service';
import { Alumno, Persona } from 'app/models/models';
import { MontoConceptoService } from 'app/service/monto_concepto.service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { PagosService } from 'app/service/pagos.service';
import { element } from 'protractor';
import { ConceptoPagoService } from 'app/service/concepto_pago.service';
import { Report } from 'notiflix';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.css']
})

export class TypographyComponent {

  formularioCobro = new FormGroup({
    cedula: new FormControl(''),
    nombre: new FormControl(''),
    tipoPago: new FormControl(''),
    importe: new FormControl(''),
  })

  conceptos: string[] = [];
  persona: Persona;
  alumnos: Alumno[] =[];
  alumno: Alumno;
  tipoPago: string;

  listaPagos: any[] = [];
  displayedColumns: string[] = ['concepto', 'importe'];
  viewPagos: Boolean = false;

  nombre: String = '';
  importe: number;

  constructor(private personaService: PersonaService,
    private alumnoService: AlumnoService, 
    private montoConceptoService: MontoConceptoService,
    private pagoService: PagosService,
    private conceptoPago: ConceptoPagoService ) {
    Object.values(Conceptos).forEach(concepto => {
      this.conceptos = [...this.conceptos, concepto]
    });

    this.alumnoService.getAll().subscribe(response => {
      this.alumnos = response;
      console.log(this.alumnos)
    })

    this.formularioCobro.controls['nombre'].disable();
    this.formularioCobro.controls['importe'].disable();
  }
  
  finalizarPago() {
    let monto_total = () => {
      let monto = 0;
      this.listaPagos.forEach(element => {
        monto += element.importe;
      })
      return monto;
    }

    this.pagoService.create({
      'monto_total': monto_total(),
      'id_alumno': this.alumno.id
    }).subscribe(res => {
      this.listaPagos.forEach((element, index) => {
        this.conceptoPago.create({
          'concepto': element.concepto,
          'monto': element.importe,
          'id_pagos': res.id
        }).subscribe(() => {
          if (index === this.listaPagos.length - 1) {
            this.formularioCobro.reset();
            Report.success(
              'Éxito',
              'Los pagos fueron registrados con éxito',
              'Ok',
              );
            this.listaPagos = [];
            this.viewPagos = false;
          } 
        })
      });
    });
  }

  guardarPago() {
    console.log(this.formularioCobro.value);
    console.log(this.formularioCobro.controls['importe'].value)
    this.listaPagos = [...this.listaPagos, {
      'concepto': this.formularioCobro.controls['tipoPago'].value,
      'importe': this.formularioCobro.controls['importe'].value
    }]

    if (this.listaPagos.length > 0) { this.viewPagos = true; }

    // this.limpiarFormulario()
    this.formularioCobro.patchValue({'importe': ''})
    this.formularioCobro.patchValue({'tipoPago': ''})
  }

  cancelarPago() {
    this.listaPagos = [];
    this.viewPagos = false;
    this.formularioCobro.reset();
  }

  cedulaChange(event) {
    this.personaService.getPersona(event.target.value)
      .subscribe(response => {
        this.persona = response;
        // this.nombre = this.persona.nombre + ' ' + this.persona.apellido;
        this.formularioCobro.patchValue({
          'nombre': this.persona.nombre + ' ' + this.persona.apellido
        })
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
        this.importe = res.monto;
        this.formularioCobro.patchValue({'importe': this.importe})
      })
    } else if (this.tipoPago == 'Vestuario') {
        this.formularioCobro.patchValue({'importe': this.alumno.vestuario})
    } else if (this.tipoPago == 'Entrada') {
      this.formularioCobro.patchValue({'importe': this.alumno.entrada})
    } else if (this.tipoPago == 'Derecho a examen') {
      this.montoConceptoService.get(this.alumno.sa_curso.examen).subscribe(res => {
        this.importe = null;
        if (this.alumno.sa_curso.nombre === 'Pre-Ballet' || this.alumno.sa_curso.nombre === 'Preparatorio') {
          this.importe = 150000;
        } else {
          this.importe = res.monto * this.alumno.cantidad_materias;
        }
        this.formularioCobro.patchValue({'importe': this.importe})
      })
    }
  }

  limpiarFormulario() {
    this.formularioCobro.reset();
    this.nombre = ''
  }
}
