import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'app/service/persona.service';
import { AlumnoService } from 'app/service/alumno.service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Report } from 'notiflix/build/notiflix-report-aio';
import { FormGroup, FormControl } from '@angular/forms';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  beca: boolean = false;
  beneficiario: boolean = false;

  test(e){
    console.log(e)
  }

  becaFunc(e) {
    this.beca = e;
  }

  beneficiarioFunc(e) {
    this.beneficiario = e;
  }

  formularioRegistro = new FormGroup({
    cedula: new FormControl(''),
    nombre: new FormControl(''),
    apellido: new FormControl(''),
    vestuario: new FormControl(''),
    entrada: new FormControl(''),
    cantidadMaterias: new FormControl(''),
    derechoExamen: new FormControl(''),
    curso: new FormControl('')
  })

  constructor(
    private personaService: PersonaService,
    private alumnoService: AlumnoService) {}


  ngOnInit() {}

  guardarAlumno() {
    if(this.formIsValid()) {
      this.personaService.checkPersona(this.formularioRegistro.value.cedula)
      .subscribe(response => {
        if (response){
          Report.failure(
            'Error',
            'Ya existe un/a alumno/a con el número de cédula, asegúrese de haber ingresado la cédula correctamente.',
            'Aceptar',
            );
        } else {
          this.personaService.create({
            nombre: this.formularioRegistro.value.nombre,
            apellido: this.formularioRegistro.value.apellido,
            documento: this.formularioRegistro.value.cedula
          }).subscribe(data => {
            console.log(data)
            this.alumnoService.create({
              cantidad_materias: this.formularioRegistro.value.cantidadMaterias,
              derecho_examen: this.formularioRegistro.value.derechoExamen,
              vestuario: this.formularioRegistro.value.vestuario,
              curso: this.formularioRegistro.value.curso,
              entrada: this.formularioRegistro.value.entrada,
              id_persona: data.id
            }).subscribe((response) => {
              console.log(response)
              Notify.success('Registro exitoso')
              this.formularioRegistro.reset();
            })
          })
        }
      })
    } else {
      Notify.failure('Favor completar todos los campos');
    }
  }

  formIsValid(): boolean{
    let validForm = true;
    if (this.formularioRegistro.value.cedula === '' || this.formularioRegistro.value.cedula == null) {
      validForm = false;
    } else if (this.formularioRegistro.value.nombre === '' || this.formularioRegistro.value.nombre == null) {
      validForm = false;
    } else if (this.formularioRegistro.value.apellido === '' || this.formularioRegistro.value.apellido == null) {
      validForm = false;
    } else if (this.formularioRegistro.value.vestuario === '' || this.formularioRegistro.value.vestuario == null) {
      validForm = false;
    } else if (this.formularioRegistro.value.entrada === '' || this.formularioRegistro.value.entrada == null) {
      validForm = false;
    } else if (this.formularioRegistro.value.cantidadMaterias === '' || this.formularioRegistro.value.cantidadMaterias == null) {
      validForm = false;
    } else if (this.formularioRegistro.value.derechoExamen === '' || this.formularioRegistro.value.curso == null) {
      validForm = false;
    } else if (this.formularioRegistro.value.curso === '' || this.formularioRegistro.value.curso == null) {
      validForm = false;
    }

    return validForm;
  }
}
