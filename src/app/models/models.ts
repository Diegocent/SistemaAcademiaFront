export interface Persona {
    id: number;
    nombre: string;
    apellido: string;
    documento: string;
}

export interface Alumno {
    id: number;
    cantidad_materias: number;
    cuota_anual: number;
    derecho_examen: number;
    vestuario: number;
    curso: number;
    entrada: number;
}

export interface PersonaAlumno { 
    persona: Persona;
    alumno: Alumno;
}