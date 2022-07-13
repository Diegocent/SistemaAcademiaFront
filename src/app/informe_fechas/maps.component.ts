import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter} from '@angular/material/core';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { PagosService } from 'app/service/pagos.service';
import { AlumnoService } from 'app/service/alumno.service';
import { ConceptoPagoService } from 'app/service/concepto_pago.service';
import { Notify } from 'notiflix';

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
  displayedColumns: string[] = ['cedula', 'nombre', 'curso', 'concepto', 'importe'];
  dataSource: any = [];
  dataSourceBackup: any = [];
  fechaDesde: any;
  fechaHasta: any;
  viewDatasource = false;

  constructor(
    private pagoService: PagosService,
    private alumnoService: AlumnoService,
    private conceptoPago: ConceptoPagoService) { 
    this.pagoService.getAll().subscribe(res => {
      const now = new Date();
      res.forEach((pago, index) => {
        this.alumnoService.get(pago.id_alumno).subscribe(datosAlumno => {
          this.conceptoPago.getAll().subscribe(conceptos => {
            conceptos.forEach(concepto => {
              if (concepto.id_pagos === res[index].id) {
                this.dataSource = [...this.dataSource, {
                  'pago': pago,
                  'datosAlumno': datosAlumno,
                  'concepto': concepto
                }]
              }
            })
          this.dataSourceBackup = this.dataSource;
          })
        })
      })
    })
  } 

  fechaDesdeChange(event) {
    this.fechaDesde = Date.parse(event.target.value._d);
  }

  fechaHastaChange(event) {
    this.fechaHasta = Date.parse(event.target.value._d);
  }

  filtrarPagos() {
    this.dataSource = this.dataSourceBackup;
    if (this.fechaDesde === undefined || this.fechaHasta === undefined) {
      Notify.warning('Deben seleccionarse ambas fechas');
    } else if (this.fechaDesde > this.fechaHasta) {
      Notify.warning('Incongruencia en las fechas');
    } else {
      this.viewDatasource = true;
      this.dataSource = this.dataSource.filter(e => Date.parse(e.pago.fecha) >= this.fechaDesde && Date.parse(e.pago.fecha) <= this.fechaHasta)
      console.log(this.dataSource)
    }
  }

}
