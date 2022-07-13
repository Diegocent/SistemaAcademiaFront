export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    documento: string;
}

export interface Curso {
    id: number;
    nombre: string;
    cuota: number;
    examen: number;
}
export interface Alumno {
    id: number;
    cantidad_materias: number;
    derecho_examen: number;
    vestuario: number;
    id_curso: number;
    entrada: number;
    sa_curso: Curso;
    sa_persona: Persona;
}
export interface MontoConcepto {
    id: number;
    monto: number;
}
export interface PersonaAlumno { 
    persona: Persona;
    alumno: Alumno;
    cuota: Curso;
    examen: Curso;
    curso: string;
}