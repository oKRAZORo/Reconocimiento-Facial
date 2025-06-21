import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../services/usuario.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.page.html',
  styleUrls: ['./lista.page.scss'],
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
    IonButton,
    IonIcon,
    IonLabel,
  ],
})
export class ListaPage implements OnInit {
  usuarios: any[] = [];

  constructor(
    private usuarioService: UsuarioService,
    private alertCtrl: AlertController
  ) {}

  /* ───────── Ciclo de vida ───────── */
  ngOnInit(): void {
    this.cargarUsuarios();
  }

  /* ───────── HTTP ───────── */
  private cargarUsuarios(): void {
    this.usuarioService.obtenerUsuarios().subscribe({
      next: (res) => (this.usuarios = res),
      error: () => alert('Error al cargar los usuarios'),
    });
  }

  /* ───────── UI ───────── */
  async confirmarEliminar(usuario: any): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar usuario?',
      message: `¿Seguro que deseas eliminar al usuario: ${usuario.nombre}?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminarUsuario(usuario.id),
        },
      ],
    });

    await alert.present();
  }

  private eliminarUsuario(id: string): void {
    this.usuarioService.eliminarUsuario(id).subscribe({
      next: () => this.cargarUsuarios(), // refrescamos lista tras eliminar
      error: () => alert('Error al eliminar'),
    });
  }
}
