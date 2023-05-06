import { Component, OnInit,ViewChild } from "@angular/core";
import { AlumnoService } from "app/service/alumno.service";
import { ConceptoPagoService } from "app/service/concepto_pago.service";
import { PagosService } from "app/service/pagos.service";
import { Loading } from "notiflix/build/notiflix-loading-aio";
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

declare interface Curso{
  id: number;
  nombre: string; 
  cuota: number; 
  examen: number; 
  sa_monto_concepto: {id: number; id_concepto: number; monto: number};
}

declare interface Pago{
createdAt: Date;
fecha: Date;
id:number;
id_alumno:number;
monto_total: number;
updatedAt: Date;
}
declare interface Persona {
  apellido:string;
  createdAt:Date;
  documento:string;
  id:number;
  nombre:string;
  updatedAt:Date;
}
declare interface Alumno{
cantidad_cuotas:number;
cantidad_materias:number;
createdAt:Date;
descuento:number;
entrada:number;
id:number;
id_curso:number;
id_persona:number;
sa_curso: Curso;
sa_persona: Persona;
updatedAt:Date;
vestuario:number;
}
declare interface Concepto{
  concepto:string;
  createdAt:Date;
  id:number;
  id_pagos:number;
  monto:number;
  sa_pago: Pago;
  updatedAt:Date;
}
declare interface Tabla{
  pago: Pago,
  datosAlumno: Alumno,
  concepto: Concepto,
  fecha: Date,
}

@Component({
  selector: "app-icons",
  templateUrl: "./icons.component.html",
  styleUrls: ["./icons.component.css"],
})
export class IconsComponent implements OnInit {
  displayedColumns: string[] = [
    "cedula",
    "nombre",
    "curso",
    "concepto",
    "importe",
    "fecha",
  ];
  // dataSource = ELEMENT_DATA;

  dataSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  temp:any=[];

  constructor(
    private pagoService: PagosService,
    private alumnoService: AlumnoService,
    private conceptoPago: ConceptoPagoService
  ) {  }

  ngOnInit() {

    this.actualizar();
  }

  actualizar(){
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
              // console.log(this.temp);
              }
            });
            this.dataSource = new MatTableDataSource<Tabla>(this.temp);
            this.dataSource.paginator = this.paginator;
            // console.log('los valores de la tabla son ',this.dataSource);
          });
        });
      });
    });
  }
}
