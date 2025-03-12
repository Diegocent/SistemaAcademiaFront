import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { PersonaService } from "app/service/persona.service";
import { Conceptos } from "app/config/app-settings";
import { AlumnoService } from "app/service/alumno.service";
import { Alumno, Persona } from "app/models/models";
import { MontoConceptoService } from "app/service/monto_concepto.service";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { PagosService } from "app/service/pagos.service";
import { element } from "protractor";
import { ConceptoPagoService } from "app/service/concepto_pago.service";
import { Report } from "notiflix";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import * as moment from "moment";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-typography",
  templateUrl: "./typography.component.html",
  styleUrls: ["./typography.component.css"],
})
export class TypographyComponent {
  formularioCobro = new FormGroup({
    cedula: new FormControl(""),
    nombre: new FormControl(""),
    tipoPago: new FormControl(""),
    importe: new FormControl(""),
    cantidadCuota: new FormControl("1"),
  });

  conceptos: string[] = [];
  persona: Persona;
  alumnos: Alumno[] = [];
  alumno: Alumno;
  tipoPago: string;

  listaPagos: any[] = [];
  displayedColumns: string[] = ["concepto", "importe"];
  viewPagos: Boolean = false;

  nombre: String = "";
  importe: number;
  pagoCuota: Boolean = false;

  cantidadCuota = 1;
  cuotaActual = 0;

  constructor(
    private personaService: PersonaService,
    private alumnoService: AlumnoService,
    private montoConceptoService: MontoConceptoService,
    private pagoService: PagosService,
    private conceptoPago: ConceptoPagoService
  ) {
    Object.values(Conceptos).forEach((concepto) => {
      this.conceptos = [...this.conceptos, concepto];
    });
    // 10-this.alumno.cantidad_materias
    // this.alumno.cantidad_cuota = actual - 1
    this.alumnoService.getAll().subscribe((response) => {
      this.alumnos = response;
      console.log(this.alumnos);
    });

    this.formularioCobro.controls["nombre"].disable();
    this.formularioCobro.controls["importe"].disable();
  }

  finalizarPago() {
    this.createPdf(
      this.listaPagos,
      this.persona.nombre + " " + this.persona.apellido,
      this.formularioCobro.value.cedula
    );
    let monto_total = () => {
      let monto = 0;
      let vest = 0;
      let restante = 0;
      let entr = 0;
      this.listaPagos.forEach((element) => {
        monto += element.importe;
        if (element.concepto == "vestuario") {
          vest= 1;
        }
        if (element.concepto == "entrada") {
          entr= 1;
        }
      });
      if (this.formularioCobro.value.cantidadCuota > 0) {
        restante = 10 - this.cuotaActual;
        this.alumnoService
          .update(this.alumno.id, { cantidad_cuotas: restante })
          .subscribe((consulta) => {
            console.log(
              "actualizacion exitoza y la cantidad de cuotas que se pago es de : ",
              this.cuotaActual
            );
          });
      }
      if(vest == 1){
        this.alumnoService
          .update(this.alumno.id, { vestuario: 0 })
          .subscribe((consulta) => {
            console.log(
              "actualizacion exitoza y el vestuario se cero "
            );
          });
      }
      if(entr == 1){
        this.alumnoService
          .update(this.alumno.id, { entrada: 0 })
          .subscribe((consulta) => {
            console.log(
              "actualizacion exitoza y la entrada se cero "
            );
          });
      }
      return monto;
    };
    var today = new Date();
    var dd = today.getDate();

    var mm = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    this.pagoService
      .create({
        monto_total: monto_total(),
        id_alumno: this.alumno.id,
        fecha: mm + "/" + dd + "/" + yyyy,
      })
      .subscribe((res) => {
        this.listaPagos.forEach((element, index) => {
          this.conceptoPago
            .create({
              concepto: element.concepto,
              monto: element.importe,
              id_pagos: res.id,
            })
            .subscribe(() => {
              if (index === this.listaPagos.length - 1) {
                this.formularioCobro.reset();
                Report.success(
                  "Éxito",
                  "Los pagos fueron registrados con éxito",
                  "Ok"
                );
                this.listaPagos = [];
                this.viewPagos = false;
                this.cuotaActual = 0;
              }
            });
        });
      });
  }

  checkFormulario() {
    if (
      this.formularioCobro.value.tipoPago === "" ||
      this.formularioCobro.value.cedula === ""
    )
      return false;
    return true;
  }

  guardarPago() {
    if (this.checkFormulario() === false) {
      Notify.warning("Se deben completar todos los campos.");
    } else {
      if (this.cuotaActual + 1 > 10) {
        Notify.info("Ya no quedan cuotas por pagar.");
      } else {
        if (this.formularioCobro.value.cantidadCuota > 1) {
          for (let i = 0; i < this.formularioCobro.value.cantidadCuota; i++) {
            this.listaPagos = [
              ...this.listaPagos,
              {
                concepto:
                  this.formularioCobro.controls["tipoPago"].value +
                  (this.formularioCobro.controls["tipoPago"].value === "Cuota"
                    ? //aca se viene el desmadre
                      " " + ++this.cuotaActual
                    : ""),
                importe:
                  this.formularioCobro.controls["importe"].value /
                  this.cantidadCuota,
              },
            ];
          }
        } else {
          this.listaPagos = [
            ...this.listaPagos,
            {
              concepto:
                this.formularioCobro.controls["tipoPago"].value +
                (this.formularioCobro.controls["tipoPago"].value === "Cuota"
                  ? //aca se viene el desmadre
                    " " + ++this.cuotaActual
                  : ""),
              importe: this.formularioCobro.controls["importe"].value,
            },
          ];
        }
      }

      if (this.listaPagos.length > 0) {
        this.viewPagos = true;
      }

      // this.limpiarFormulario()
      this.formularioCobro.patchValue({ importe: "" });
      this.formularioCobro.patchValue({ tipoPago: "" });
    }
  }

  cancelarPago() {
    this.listaPagos = [];
    this.viewPagos = false;
    this.formularioCobro.reset();
  }

  cedulaChange(event) {
    this.personaService.getPersona(event.target.value).subscribe((response) => {
      this.persona = response;
      // this.nombre = this.persona.nombre + ' ' + this.persona.apellido;
      this.formularioCobro.patchValue({
        nombre: this.persona.nombre + " " + this.persona.apellido,
      });
      // console.log(response)
      this.alumnos.forEach((alumno) => {
        if (alumno.sa_persona.id === this.persona.id) {
          this.alumno = alumno;
          this.cuotaActual = 10 - alumno.cantidad_cuotas;
          console.log(this.alumno);
          console.log("la cantidad de cuotas para este es: ",this.cuotaActual);
        }
      });
      this.formularioCobro.patchValue({ importe: "" });
    });
  }

  cantidadCuotaChange(event) {
    this.cantidadCuota = event.target.value;
    this.formularioCobro.patchValue({
      importe: this.importe * event.target.value,
    });
  }

  conceptoChange(concepto) {
    // console.log("disparado")
    this.tipoPago = concepto.value;
    this.pagoCuota = false;
    if (this.tipoPago === "Cuota") {
      this.pagoCuota = true;
      this.montoConceptoService
        .get(this.alumno.sa_curso.cuota)
        .subscribe((res) => {
          console.log("res", res);
          this.importe = res.monto-this.alumno.descuento;
          this.formularioCobro.patchValue({
            importe: this.importe * this.formularioCobro.value.cantidadCuota,
          });
        });
    } else if (this.tipoPago == "Vestuario") {
      this.formularioCobro.patchValue({ importe: this.alumno.vestuario });
    } else if (this.tipoPago == "Entrada") {
      this.formularioCobro.patchValue({ importe: this.alumno.entrada });
    } else if (this.tipoPago == "Derecho a examen") {
      this.montoConceptoService
        .get(this.alumno.sa_curso.examen)
        .subscribe((res) => {
          this.importe = null;
          if (
            this.alumno.sa_curso.nombre === "Pre-Ballet" ||
            this.alumno.sa_curso.nombre === "Preparatorio"
          ) {
            this.importe = 150000;
          } else {
            this.importe = res.monto * this.alumno.cantidad_materias;
          }
          this.formularioCobro.patchValue({ importe: this.importe });
        });
    } else if(this.tipoPago=="Matricula"){
      this.formularioCobro.controls["importe"].enable();
    }
  }

  limpiarFormulario() {
    this.formularioCobro.reset();
    this.nombre = "";
  }

  createPdf(listaPagos, nombre, documento) {
    const temp = 2;
    var d = new Date();
    let monto = 0;
    let vector: any[] = [];
    listaPagos.forEach((element) => {
      monto += element.importe;
    });
    console.log(monto);
    console.log(listaPagos.length);

    if (listaPagos.length < 5) {
      let i = 0;
      for (i; i < 5; i++) {
        if (i < listaPagos.length) {
          vector[i] = listaPagos[i];
        } else {
          vector[i] = {
            concepto: "      ",
            importe: "       ",
          };
        }
      }
    } else {
      let i = 0;
      for (i; i < 5; i++) {
        vector[i] = listaPagos[i];
      }
    }
    console.log(vector);
    var dd = {
      content: [
        { text: "Recibo", style: "header" },
        {
          style: "tableExample",
          color: "#444",
          table: {
            widths: [200, 50, 75, 75],
            // heights: [20, 'auto', 'auto'],
            // keepWithHeaderRows: 1,
            body: [
              [
                {
                  rowSpan: 3,
                  colSpan: 2,
                  text: "Escuela de Danzas\nPykasu Jeroky\nde Lourdes Nataloni",
                  alignment: "center",
                  fontSize: 12,
                },
                "",
                {
                  colSpan: 2,
                  text: "Recibo de Dinero",
                  alignment: "center",
                  fontSize: 12,
                  bold: true,
                },
                "",
              ],
              // [{text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}],
              // [{text: 'Header 1', style: 'tableHeader', alignment: 'center'}, {text: 'Header 2', style: 'tableHeader', alignment: 'center'}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}],
              ["", "", { colSpan: 2, text: "Gs.:" + monto, fontSize: 12 }, ""],
              ["", "", { colSpan: 2, text: "N°.:", fontSize: 12 }, ""],
              [
                {
                  colSpan: 4,
                  text: "Fecha de emision " + moment(d).format("D MMMM YYYY"),
                  fontSize: 10,
                  border: [true, false, true, false],
                },
                "",
                "",
                "",
              ],
              [
                {
                  colSpan: 4,
                  text: "Recibimos a Favor de " + nombre,
                  fontSize: 10,
                  border: [true, false, true, false],
                },
                "",
                "",
                "",
              ],
              [
                {
                  colSpan: 4,
                  text: "Con C.I. N.: " + documento,
                  fontSize: 10,
                  border: [true, false, true, false],
                },
                "",
                "",
                "",
              ],
              [
                { text: "Conceptos de pago" },
                "Cantidad",
                "Precio Unitaro",
                "Precio Total",
              ],
              [vector[0].concepto, "", vector[0].importe, vector[0].importe],
              [vector[1].concepto, "", vector[1].importe, vector[1].importe],
              [vector[2].concepto, "", vector[2].importe, vector[2].importe],
              [vector[3].concepto, "", vector[3].importe, vector[3].importe],
              [vector[4].concepto, "", vector[4].importe, vector[4].importe],
              [{ colSpan: 3, text: "Total" }, "", "", monto],
            ],
          },
        },
        {
          text: "----------------------------------------------------------------------",
          style: "header",
        },
        {
          style: "tableExample",
          color: "#444",
          table: {
            widths: [200, 50, 75, 75],
            // heights: [20, 'auto', 'auto'],
            // keepWithHeaderRows: 1,
            body: [
              [
                {
                  rowSpan: 3,
                  colSpan: 2,
                  text: "Escuela de Danzas\nPykasu Jeroky\nde Lourdes Nataloni",
                  alignment: "center",
                  fontSize: 12,
                },
                "",
                {
                  colSpan: 2,
                  text: "Recibo de Dinero",
                  alignment: "center",
                  fontSize: 12,
                  bold: true,
                },
                "",
              ],
              // [{text: 'Header with Colspan = 2', style: 'tableHeader', colSpan: 2, alignment: 'center'}, {}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}],
              // [{text: 'Header 1', style: 'tableHeader', alignment: 'center'}, {text: 'Header 2', style: 'tableHeader', alignment: 'center'}, {text: 'Header 3', style: 'tableHeader', alignment: 'center'}],
              ["", "", { colSpan: 2, text: "Gs.:" + monto, fontSize: 12 }, ""],
              ["", "", { colSpan: 2, text: "N°.:", fontSize: 12 }, ""],
              [
                {
                  colSpan: 4,
                  text: "Fecha de emision " + moment(d).format("D MMMM YYYY"),
                  fontSize: 10,
                  border: [true, false, true, false],
                },
                "",
                "",
                "",
              ],
              [
                {
                  colSpan: 4,
                  text: "Recibimos a Favor de " + nombre,
                  fontSize: 10,
                  border: [true, false, true, false],
                },
                "",
                "",
                "",
              ],
              [
                {
                  colSpan: 4,
                  text: "Con C.I. N.: " + documento,
                  fontSize: 10,
                  border: [true, false, true, false],
                },
                "",
                "",
                "",
              ],
              [
                { text: "Conceptos de pago" },
                "Cantidad",
                "Precio Unitaro",
                "Precio Total",
              ],
              [vector[0].concepto, "", vector[0].importe, vector[0].importe],
              [vector[1].concepto, "", vector[1].importe, vector[1].importe],
              [vector[2].concepto, "", vector[2].importe, vector[2].importe],
              [vector[3].concepto, "", vector[3].importe, vector[3].importe],
              [vector[4].concepto, "", vector[4].importe, vector[4].importe],
              [{ colSpan: 3, text: "Total" }, "", "", monto],
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5],
        },
        tableExample: {
          margin: [0, 5, 0, 15],
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: "black",
        },
      },
      defaultStyle: {
        // alignment: 'justify'
      },
    };

    const pdfimpr = pdfMake.createPdf(dd);
    pdfimpr.open();
  }
}
