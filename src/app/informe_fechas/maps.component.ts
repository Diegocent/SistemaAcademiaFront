import { Component, OnInit, ViewChild } from "@angular/core";
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import { DateAdapter } from "@angular/material/core";
import { Report } from "notiflix/build/notiflix-report-aio";
import { PagosService } from "app/service/pagos.service";
import { AlumnoService } from "app/service/alumno.service";
import { ConceptoPagoService } from "app/service/concepto_pago.service";
// import { Notify } from 'notiflix';
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";

import { DecimalPipe } from "@angular/common";

export const DateFormat = {
  parse: {
    dateInput: "input",
  },
  //  display: {
  //  dateInput: 'MM/DD/YYYY',
  //  monthYearLabel: 'MMMM YYYY',
  //  dateA11yLabel: 'MM/DD/YYYY',
  //  monthYearA11yLabel: 'MMMM YYYY',
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MMMM YYYY",
  },
};
declare interface Curso {
  id: number;
  nombre: string;
  cuota: number;
  examen: number;
  sa_monto_concepto: { id: number; id_concepto: number; monto: number };
}

declare interface Pago {
  createdAt: Date;
  fecha: Date;
  id: number;
  id_alumno: number;
  monto_total: number;
  updatedAt: Date;
}
declare interface Persona {
  apellido: string;
  createdAt: Date;
  documento: string;
  id: number;
  nombre: string;
  updatedAt: Date;
}
declare interface Alumno {
  cantidad_cuotas: number;
  cantidad_materias: number;
  createdAt: Date;
  descuento: number;
  entrada: number;
  id: number;
  id_curso: number;
  id_persona: number;
  sa_curso: Curso;
  sa_persona: Persona;
  updatedAt: Date;
  vestuario: number;
}
declare interface Concepto {
  concepto: string;
  createdAt: Date;
  id: number;
  id_pagos: number;
  monto: number;
  sa_pago: Pago;
  updatedAt: Date;
}
declare interface Tabla {
  pago: Pago;
  datosAlumno: Alumno;
  concepto: Concepto;
  fecha: Date;
}

@Component({
  selector: "app-maps",
  templateUrl: "./maps.component.html",
  styleUrls: ["./maps.component.css"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: DateFormat },
    DecimalPipe,
  ],
})
export class MapsComponent implements OnInit {
  displayedColumns: string[] = [
    "cedula",
    "nombre",
    "curso",
    "concepto",
    "importe",
    "fecha",
  ];
  dataSource: any = [];
  dataSourceBackup: any = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  temp: any = [];
  fechaDesde: any;
  fechaHasta: any;
  viewDatasource = false;
  totalImportes: number = 0;

  constructor(
    private pagoService: PagosService,
    private alumnoService: AlumnoService,
    private conceptoPago: ConceptoPagoService
  ) {}

  ngOnInit(): void {
    this.actualizar();
  }
  actualizar() {
    this.pagoService.getAll().subscribe((res) => {
      const now = new Date();
      // console.log('pagos ',res);
      res.forEach((pago, index) => {
        // console.log(pago,index);
        this.alumnoService.get(pago.id_alumno).subscribe((datosAlumno) => {
          this.conceptoPago.getAll().subscribe((conceptos) => {
            conceptos.forEach((concepto) => {
              if (concepto.id_pagos === pago.id) {
                var dato = new Date(pago.fecha);
                var dd = dato.getDate();
                var mm = dato.getMonth() + 1;
                var yyyy = dato.getFullYear();
                var aux = dd + "/" + mm + "/" + yyyy;
                console.log(aux);
                this.temp = [
                  ...this.temp,
                  {
                    pago: pago,
                    datosAlumno: datosAlumno,
                    concepto: concepto,
                    fecha: aux,
                  },
                ];
                this.totalImportes += concepto.monto;
                // console.log(this.temp);
              }
            });
            this.temp.sort((a, b) => {
              return new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
            });
            this.dataSource = new MatTableDataSource<Tabla>(this.temp);
            this.dataSource.paginator = this.paginator;
            // console.log('los valores de la tabla son ',this.dataSource);
            this.dataSourceBackup = this.temp;
            console.log(
              "dentro de actualizar muestra lo siguiente: ",
              this.temp
            );
          });
        });
      });
    });
  }
  fechaDesdeChange(event) {
    this.fechaDesde = Date.parse(event.target.value._d);
  }

  fechaHastaChange(event) {
    this.fechaHasta = Date.parse(event.target.value._d);
  }

  filtrarPagos() {
    console.log("entra en filtrar pagos");
    this.temp = this.dataSourceBackup;
    if (this.fechaDesde === undefined || this.fechaHasta === undefined) {
      // Notify.warning('Deben seleccionarse ambas fechas');
      console.log("Deben seleccionarse ambas fechas");
    } else if (this.fechaDesde > this.fechaHasta) {
      // Notify.warning('Incongruencia en las fechas');
    } else {
      this.totalImportes = 0;
      console.log("llega a la condicional que filtra");
      this.viewDatasource = true;
      this.temp = this.temp.filter(
        (e) =>
          Date.parse(e.pago.fecha) >= this.fechaDesde &&
          Date.parse(e.pago.fecha) <= this.fechaHasta
      );
      this.dataSource = new MatTableDataSource<Tabla>(this.temp);
      this.dataSource.paginator = this.paginator;
      this.temp.forEach((dato) => {
        this.totalImportes += dato.concepto.monto;
        // console.log(this.temp);
      });
      console.log(
        "luego de aplicar el filtro el resultado es el siguiente",
        this.dataSource
      );
    }
  }
}
