import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ValidacionService {
  public API_URL = 'http://localhost:5000/usuarios/validate-photo';

  constructor(public http: HttpClient) {}

  validarImagen(imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post(this.API_URL, formData);
  }
}
