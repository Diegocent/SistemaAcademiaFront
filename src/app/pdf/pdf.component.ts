import { Component, Input, OnInit } from "@angular/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-pdf",
  templateUrl: "./pdf.component.html",
  styleUrls: ["./pdf.component.css"],
})
export class PdfComponent implements OnInit {
  @Input() nombre: any;
  fecha: Date;
  @Input() monto: number;
  concepto: string;
  monto_unitario: number;
  cantidad: number;
  monto_total: number;

  constructor() {}

  ngOnInit() {}

  createPdf() {
    const temp = 2;
    console.log(this.nombre);
    console.log(this.monto);
    var dd = {
      content: [
        { text: "Recibo", style: "header" },
        "Each cell-element can set a rowSpan or colSpan",
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
              ["", "", { colSpan: 2, text: "Gs.:", fontSize: 12 }, ""],
              ["", "", { colSpan: 2, text: "N°.:", fontSize: 12 }, ""],
              [
                { text: "Conceptos de pago" },
                "Cantidad",
                "Precio Unitaro",
                "Precio Total",
              ],
              ["Concepto", "Sample value 2", "", "Sample value 3"],
              ["Concepto", temp, "", "Sample value 3"],
              ["Concepto", "Sample value 2", "", "Sample value 3"],
              [{ colSpan: 3, text: "Total" }, "", "", "Valor"],
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
