import { Component, OnInit } from '@angular/core';
import { PersonaService } from 'app/service/persona.service';
import { AlumnoService } from 'app/service/alumno.service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  constructor(
    private personaService: PersonaService, 
    private alumnoService: AlumnoService) {}

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

  ngOnInit() {
  }

  guardarAlumno() {
    if (this.formIsValid()) {
      this.personaService.create({
        nombre: this.formularioRegistro.value.nombre,
        apellido: this.formularioRegistro.value.apellido,
        documento: this.formularioRegistro.value.cedula
      }).subscribe(data => {
        this.alumnoService.create({
          cantidad_materias: this.formularioRegistro.value.cantidadMaterias,
          derecho_examen: this.formularioRegistro.value.derechoExamen,
          vestuario: this.formularioRegistro.value.vestuario,
          curso: this.formularioRegistro.value.curso,
          id_persona: data.id
        }).subscribe(response => {
          Notify.success("Registro exitoso")
          this.formularioRegistro.reset();
        })
      })
    } else {
      Notify.failure("Favor completar todos los campos")
    }
  }

  formIsValid(): boolean{
    if (this.formularioRegistro.value.cedula == '' || this.formularioRegistro.value.nombre  == '' || this.formularioRegistro.value.apellido == '' ||
      this.formularioRegistro.value.vestuario == '' || this.formularioRegistro.value.entrada == '' || this.formularioRegistro.value.cantidadMaterias == ''||
      this.formularioRegistro.value.derechoExamen == '' || this.formularioRegistro.value.curso == '') {
        return false;
      }  
      return true;
  }
}
