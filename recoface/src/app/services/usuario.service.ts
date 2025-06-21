import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';  // 👈 Importamos la variable

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  registrarUsuario(data: { nombre: string; email: string }): Observable<any> {
    return this.http.post(`${this.API_URL}`, data);
  }

  subirFotoUsuario(id: number, imagen: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', imagen);
    return this.http.post(`${this.API_URL}/photoupload/${id}`, formData);
  }

  eliminarUsuario(id: string): Observable<any> {
    return this.http.delete(`${this.API_URL}/${id}`);
  }

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/listar`);
  }
}
