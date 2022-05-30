import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// const baseUrl = 'http://localhost:8080/api/cursos/';
const baseUrl = 'https://app-sistemaacademia.herokuapp.com/api/cursos/';

@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(`${baseUrl}`);
  }

  get(id): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

//   create(data): Observable<any> {
//     return this.http.post(baseUrl, data);
//   }

//   update(id, data): Observable<any> {
//     return this.http.put(`${baseUrl}/${id}`, data);
//   }

//   delete(id): Observable<any> {
//     return this.http.delete(`${baseUrl}/${id}`);
//   }

}
