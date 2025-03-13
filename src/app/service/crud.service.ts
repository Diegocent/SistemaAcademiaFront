import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { URL } from "app/config/app-settings";
@Injectable({
  providedIn: "root",
})
export class CrudService {
  REST_API: string = URL;
  httpHeaders = new HttpHeaders().set("Content-Type", "application/json");
  constructor(private httpClient: HttpClient) {}
}
