import { Component, OnInit } from "@angular/core";
import { AlumnoService } from "app/service/alumno.service";
import { ConceptoPagoService } from "app/service/concepto_pago.service";
import { PagosService } from "app/service/pagos.service";
import { Loading } from "notiflix/build/notiflix-loading-aio";

@Component({
  selector: "app-icons",
  templateUrl: "./icons.component.html",
  styleUrls: ["./icons.component.css"],
})
export class IconsComponent {
  displayedColumns: string[] = [
    "cedula",
    "nombre",
    "curso",
    "concepto",
    "importe",
    "fecha",
  ];
  // dataSource = ELEMENT_DATA;

  dataSource: any = [];

  constructor(
    private pagoService: PagosService,
    private alumnoService: AlumnoService,
    private conceptoPago: ConceptoPagoService
  ) {
    this.pagoService.getAll().subscribe((res) => {
      const now = new Date();
      res.forEach((pago, index) => {
        this.alumnoService.get(pago.id_alumno).subscribe((datosAlumno) => {
          this.conceptoPago.getAll().subscribe((conceptos) => {
            conceptos.forEach((concepto) => {
              if (concepto.id_pagos === res[index].id) {
                var dato = new Date(pago.fecha);
                var dd = dato.getDate();
                var mm = dato.getMonth() + 1;
                var yyyy = dato.getFullYear();
                var aux = dd + "/" + mm + "/" + yyyy;
                console.log(aux);
                this.dataSource = [
                  ...this.dataSource,
                  {
                    pago: pago,
                    datosAlumno: datosAlumno,
                    concepto: concepto,
                    fecha: aux,
                  },
                ];
                var ordenado = this.dataSource.sort(function(a, b) {var firstDate = new Date(a.fecha),
                  SecondDate = new Date(b.fecha);
                  
                if (firstDate < SecondDate) return -1;
                if (firstDate > SecondDate) return 1;
                return 0;
              });
                console.log(ordenado);
              }
            });
          });
        });
      });
    });
  }
}
