import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { URL } from "app/config/app-settings";

const baseUrl = `${URL}/api/pagos/`;

@Injectable({
  providedIn: "root",
})
export class PagosService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<any> {
    return this.http.get(`${baseUrl}`);
  }

  get(id): Observable<any> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  create(data): Observable<any> {
    return this.http.post(baseUrl, data);
  }

  update(id, data): Observable<any> {
    return this.http.put(`${baseUrl}/${id}`, data);
  }

  delete(id): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
}
