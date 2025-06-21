import { Component } from '@angular/core';
import { UsuarioService } from '../services/usuario.service';
import { FormsModule } from '@angular/forms';
import {
  IonInput,
  IonItem,
  IonLabel,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonToolbar,
  IonHeader,
  IonTitle,
  IonAlert,
  IonContent,
} from '@ionic/angular/standalone';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonItem,
    IonLabel,
    IonInput,
    IonAlert,
    IonButton
  ],
})
export class RegistroPage {
  nombre = '';
  email = '';
  imagenFile?: File;
  mensaje: string = '';
  mostrarAlerta: boolean = false;

  alertButtons = [
    {
      text: 'Cerrar',
      role: 'cancel',
      handler: () => this.cerrarAlerta()
    }
  ];

  constructor(public usuarioService: UsuarioService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenFile = input.files[0];
    }
  }

  async tomarFoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      const blob = await (await fetch(photo.dataUrl!)).blob();
      this.imagenFile = new File([blob], 'foto.jpg', { type: blob.type });

    } catch (error) {
      console.error('Error al tomar la foto:', error);
      this.mostrarModal('No se pudo acceder a la cámara.');
    }
  }

  mostrarModal(mensaje: string) {
    this.mensaje = mensaje;
    this.mostrarAlerta = true;
  }

  cerrarAlerta() {
    this.mostrarAlerta = false;
    this.limpiarFormulario();
  }

  limpiarFormulario() {
    this.nombre = '';
    this.email = '';
    this.imagenFile = undefined;
    const inputFile = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (inputFile) inputFile.value = '';
  }

  registrarUsuario(event: Event) {
    event.preventDefault();
    const datos = { nombre: this.nombre, email: this.email };

    this.usuarioService.registrarUsuario(datos).subscribe({
      next: (res) => {
        const id = res.id;
        if (this.imagenFile) {
          this.usuarioService.subirFotoUsuario(id, this.imagenFile).subscribe({
            next: () => this.mostrarModal('Usuario registrado correctamente'),
            error: () => this.mostrarModal('Error al subir la imagen')
          });
        } else {
          this.mostrarModal('Usuario registrado (sin imagen)');
        }
      },
      error: (err) => {
        if (err.status === 409) {
          this.mostrarModal('El correo ya está registrado');
        } else {
          this.mostrarModal('Error al registrar el usuario');
        }
      }
    });
  }
}
