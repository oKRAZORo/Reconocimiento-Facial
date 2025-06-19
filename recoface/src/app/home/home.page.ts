import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonItem,
    IonLabel,
    IonInput,
    IonButton,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent
  ],
})
export class HomePage {
  selectedTab: string = 'registro';

  nombre: string = '';
  email: string = '';
  imagenFile?: File;

  usuarios: any[] = []; // Lista de usuarios

  imagenValidar?: File; // Imagen para validación
  resultadoValidacion: string = ''; // Resultado textual
  fotoPerfil: string = ''; // URL de imagen reconocida

  constructor(private http: HttpClient) {}

  selectTab(tab: string) {
    this.selectedTab = tab;
    if (tab === 'lista') {
      this.obtenerUsuarios();
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenFile = input.files[0];
    }
  }

  registrarUsuario(event: Event) {
    event.preventDefault();

    const datos = { nombre: this.nombre, email: this.email };

    this.http.post<any>('http://localhost:5000/usuarios', datos).subscribe({
      next: (response) => {
        const id = response.id;
        if (this.imagenFile) {
          const formData = new FormData();
          formData.append('imagen', this.imagenFile);

          this.http.post(`http://localhost:5000/usuarios/photoupload/${id}`, formData).subscribe({
            next: () => alert('Usuario registrado correctamente'),
            error: () => alert('Error al subir imagen')
          });
        } else {
          alert('Usuario registrado (sin imagen)');
        }
      },
      error: (error) => {
        if (error.status === 409) {
          alert('El correo ya está registrado');
        } else {
          alert('Error al registrar usuario');
        }
      }
    });
  }

  obtenerUsuarios() {
    this.http.get<any[]>('http://localhost:5000/usuarios/listar').subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: () => {
        alert('Error al obtener usuarios');
      }
    });
  }

  // Selección de imagen para validación
  onValidarFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenValidar = input.files[0];
    }
  }

  // Validación facial
  validarImagen() {
    if (!this.imagenValidar) {
      alert('Selecciona una imagen para validar');
      return;
    }

    const formData = new FormData();
    formData.append('imagen', this.imagenValidar);

    this.http.post<any>('http://localhost:5000/usuarios/validate-photo', formData).subscribe({
      next: (res) => {
        if (res.usuario && res.usuario.nombre) {
          this.resultadoValidacion = `Usuario reconocido: ${res.usuario.nombre} (${res.usuario.email})`;
          this.fotoPerfil = res.foto_perfil || '';
        } else {
          this.resultadoValidacion = 'Usuario no reconocido';
          this.fotoPerfil = '';
        }
      },
      error: () => {
        this.resultadoValidacion = 'Error al validar imagen';
        this.fotoPerfil = '';
      }
    });
  }
}






