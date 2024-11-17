import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  passwordVisible: boolean = false; // Controla la visibilidad de la contraseña

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; // Alterna la visibilidad
  }

}
