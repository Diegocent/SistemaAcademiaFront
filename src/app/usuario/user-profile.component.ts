import { Component, Input, OnInit } from "@angular/core";
import { PersonaService } from "app/service/persona.service";
import { AlumnoService } from "app/service/alumno.service";
import { CursoService } from "app/service/curso.service";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { Report } from "notiflix/build/notiflix-report-aio";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Alumno, Curso, Persona, PersonaAlumno } from "app/models/models";
import { MontoConceptoService } from "app/service/monto_concepto.service";
@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  @Input() edit;
  @Input() personaEdit: Persona;
  @Input() alumnoEdit: Alumno;

  beneficiario: boolean = false;
  beca: boolean = false;
  noBecaNoDescuento: boolean = true;
  cursos: Curso[] = [];

  formularioRegistro = new FormGroup({
    cedula: new FormControl(""),
    nombre: new FormControl(""),
    apellido: new FormControl(""),
    vestuario: new FormControl(""),
    entrada: new FormControl(""),
    cantidadMaterias: new FormControl(""),
    derechoExamen: new FormControl(""),
    curso: new FormControl(""),
    descuento: new FormControl(""),
    cantidadDescuento: new FormControl(""),
    cantidadcuotas: new FormControl(""),
  });

  becaFuncionario(e) {
    console.log(e.value);
    if (e.value === "descuento") {
      this.beneficiario = true;
      this.beca = false;
    }
    if (e.value === "beca") {
      this.beca = true;
      this.beneficiario = false;
    }
    if (e.value === "ninguno") {
      this.beca = false;
      this.beneficiario = false;
    }

    console.log(this.formularioRegistro.value.opcionesDescuento);
  }

  constructor(
    private personaService: PersonaService,
    private alumnoService: AlumnoService,
    private cursoService: CursoService,
    private montoConceptoService: MontoConceptoService
  ) {}

  ngOnInit() {
    this.cursoService.getAll().subscribe((result) => {
      this.cursos = result;
    });
    if (this.personaEdit !== undefined || this.personaEdit !== undefined) {
      //es para modificar
      console.log("holaaa", this.alumnoEdit);
      this.formularioRegistro.patchValue({
        cedula: this.personaEdit.documento,
        apellido: this.personaEdit.apellido,
        nombre: this.personaEdit.nombre,
        cantidadMaterias: this.alumnoEdit.cantidad_materias,
      });

      this.cursoService.get(this.alumnoEdit.id_curso).subscribe((curso) => {
        this.formularioRegistro.patchValue({
          curso: curso,
        });
        console.log("seteamos el curso");
      });
      // if (this.alumnoEdit.descuento > 0) {
      //   this.montoConceptoService.get(this.alumnoEdit.id_curso).subscribe(concepto => {
      //     let cuotaCurso = concepto.monto;
      //     if (this.alumnoEdit.descuento === (cuotaCurso/2)) {
      //       let becaRadio = document.getElementById("beca");
      //       becaRadio.checked = true;
      //     }
      //   })
      // }
    }
    console.log(this.personaEdit);
    console.log(this.alumnoEdit);
  }

  guardarAlumno() {
    console.log(this.formularioRegistro.value);
    console.log(this.beneficiario);
    if (this.formIsValid()) {
      this.personaService
        .checkPersona(this.formularioRegistro.value.cedula)
        .subscribe((response) => {
          if (response) {
            Report.failure(
              "Error",
              "Ya existe un/a alumno/a con el número de cédula, asegúrese de haber ingresado la cédula correctamente.",
              "Aceptar"
            );
          } else {
            this.personaService
              .create({
                nombre: this.formularioRegistro.value.nombre,
                apellido: this.formularioRegistro.value.apellido,
                documento: this.formularioRegistro.value.cedula,
              })
              .subscribe((data) => {
                let descuento = 0;
                let idCuota = this.formularioRegistro.value.curso.cuota;
                this.montoConceptoService.get(idCuota).subscribe((res) => {
                  console.log("beca", this.beca);
                  if (this.beca) {
                    descuento = res.monto - res.monto * 0.5;
                  } else if (this.beneficiario) {
                    descuento = this.formularioRegistro.value.cantidadDescuento;
                  }
                  this.alumnoService
                    .create({
                      cantidad_materias:
                        this.formularioRegistro.value.cantidadMaterias,
                      // derecho_examen: this.formularioRegistro.value.derechoExamen,
                      vestuario: 0,
                      id_curso: this.formularioRegistro.value.curso.id,
                      entrada: 0,
                      descuento: descuento,
                      cantidad_cuotas:
                        this.formularioRegistro.value.cantidadcuotas,
                      id_persona: data.id,
                    })
                    .subscribe((response) => {
                      console.log(response);
                      Notify.success("Registro exitoso");
                      this.formularioRegistro.reset();
                    });
                });
              });
          }
        });
    } else {
      Notify.failure("Favor completar todos los campos");
    }
  }

  formIsValid(): boolean {
    let validForm = true;
    if (
      this.formularioRegistro.value.cedula === "" ||
      this.formularioRegistro.value.cedula == null
    ) {
      validForm = false;
    } else if (
      this.formularioRegistro.value.nombre === "" ||
      this.formularioRegistro.value.nombre == null
    ) {
      validForm = false;
    } else if (
      this.formularioRegistro.value.apellido === "" ||
      this.formularioRegistro.value.apellido == null
    ) {
      validForm = false;
    } else if (
      this.formularioRegistro.value.cantidadMaterias === "" ||
      this.formularioRegistro.value.cantidadMaterias == null
    ) {
      validForm = false;
    } else if (
      this.formularioRegistro.value.curso === "" ||
      this.formularioRegistro.value.curso == null
    ) {
      validForm = false;
    } else if (
      this.formularioRegistro.value.cantidadcuotas === "" ||
      this.formularioRegistro.value.cantidadcuotas == null
    ) {
      validForm = false;
    } else if (
      this.beneficiario &&
      this.formularioRegistro.value.cantidadDescuento === ""
    ) {
      validForm = false;
    }

    return validForm;
  }
}
