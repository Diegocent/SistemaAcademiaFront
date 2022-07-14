import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Curso } from "app/models/models";
import { ConceptoService } from "app/service/concepto.service";
import { CursoService } from "app/service/curso.service";
import { MontoConceptoService } from "app/service/monto_concepto.service";
import { Notify } from "notiflix";
import { Report } from "notiflix/build/notiflix-report-aio";
declare var $: any;
@Component({
  selector: "app-notifications",
  templateUrl: "./notifications.component.html",
  styleUrls: ["./notifications.component.css"],
})
export class NotificationsComponent implements OnInit {
  conceptos: string[] = [];
  cursos: Curso[] = [];

  formulario = new FormGroup({
    cursoSeleccionado: new FormControl(""),
    monto: new FormControl(""),
    tipoPago: new FormControl(""),
  });

  constructor(
    private cursoService: CursoService,
    private montoConceptoService: MontoConceptoService,
    private conceptoService: ConceptoService
  ) {}
  ngOnInit() {
    this.conceptoService.getAll().subscribe((response) => {
      response.forEach((element) => {
        if (element.id == 1 || element.id == 3) {
          this.conceptos.push(element);
        }
      });
      console.log(this.conceptos);
    });

    this.cursoService.getAll().subscribe((res) => {
      this.cursos = res;
      console.log(this.cursos);
    });
  }

  modificar() {
    if (this.formIsValid()) {
      if (this.formulario.value.tipoPago == 1) {
        console.log(this.formulario.value.cursoSeleccionado);
        let data = {
          monto: this.formulario.value.monto,
        };
        // this.
        console.log(this.formulario.value.monto);
        this.montoConceptoService
          .update(this.formulario.value.cursoSeleccionado.cuota, data)
          .subscribe((res) => console.log(res));
      } else {
        console.log(this.formulario.value.cursoSeleccionado);
        let data = {
          monto: this.formulario.value.monto,
        };
        // this.
        console.log(this.formulario.value.monto);
        this.montoConceptoService
          .update(this.formulario.value.cursoSeleccionado.examen, data)
          .subscribe((res) => console.log(res));
      }
      this.formulario.reset();
      Notify.success("Actualizado con exito");
    } else {
      Notify.failure("Favor completar todos los campos");
    }
  }
  formIsValid(): boolean {
    let validForm = true;
    if (
      this.formulario.value.cursoSeleccionado === "" ||
      this.formulario.value.cursoSeleccionado == null
    ) {
      validForm = false;
    } else if (
      this.formulario.value.monto === "" ||
      this.formulario.value.monto == null
    ) {
      validForm = false;
    } else if (
      this.formulario.value.tipoPago === "" ||
      this.formulario.value.tipoPago == null
    ) {
      validForm = false;
    }

    return validForm;
  }
}
