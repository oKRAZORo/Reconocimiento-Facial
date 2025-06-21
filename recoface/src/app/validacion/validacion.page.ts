import { Component } from '@angular/core';
import { ValidacionService } from '../services/validacion.service';

import { CommonModule } from '@angular/common';

import {
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
  IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.page.html',
  styleUrls: ['./validacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
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
    IonButton
  ],
})
export class ValidacionPage {
  imagenValidar?: File;
  resultadoValidacion: string = '';
  fotoPerfil: string = '';

  constructor(private validacionService: ValidacionService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenValidar = input.files[0];
    }
  }

  validarImagen() {
    if (!this.imagenValidar) {
      alert('Selecciona una imagen para validar');
      return;
    }

    this.validacionService.validarImagen(this.imagenValidar).subscribe({
      next: (res) => {
        if (res.usuario && res.usuario.nombre) {
          this.resultadoValidacion = `✅ Usuario reconocido: ${res.usuario.nombre} (${res.usuario.email})`;
          this.fotoPerfil = res.foto_perfil || '';
        } else {
          this.resultadoValidacion = '❌ Usuario no reconocido';
          this.fotoPerfil = '';
        }
      },
      error: () => {
        this.resultadoValidacion = '⚠️ Error al validar la imagen';
        this.fotoPerfil = '';
      }
    });
  }
}
