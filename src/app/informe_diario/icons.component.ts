import { Component, OnInit } from '@angular/core';
import { AlumnoService } from 'app/service/alumno.service';
import { ConceptoPagoService } from 'app/service/concepto_pago.service';
import { PagosService } from 'app/service/pagos.service';
import { Loading } from 'notiflix/build/notiflix-loading-aio';


@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html',
  styleUrls: ['./icons.component.css']
})
export class IconsComponent{
  displayedColumns: string[] = ['cedula', 'nombre', 'curso', 'concepto', 'importe'];
  // dataSource = ELEMENT_DATA;

  dataSource: any = [];

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
                  'pago': res,
                  'datosAlumno': datosAlumno,
                  'concepto': concepto
                }]
              }
            })
          })
        })
      })
    })
  }
}
