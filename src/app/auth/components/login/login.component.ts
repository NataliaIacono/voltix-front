import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../service/auth-service.service';
import { StateService } from '../../../core/state/state.service';
import { LoginResponse } from '../../../core/model/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  private service = inject(AuthService);
  private stateService = inject(StateService);
  private router = inject(Router);

  passwordVisible: boolean = false;

  login: FormGroup;

  // Estados para validación del formulario
  usuarioCorrecto: boolean = false;
  passwordCorrecta: boolean = false;
  userNotFound: boolean = false;
  passwordNotFound: boolean = false;
  camposIncompletos: boolean = false;

  constructor(private fb: FormBuilder) {
    // Inicializa el formulario
    //Dejar campo vacio una vez que funcioan el login
    this.login = this.fb.group({
      dni: ['', [Validators.required, Validators.minLength(8)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    // Suscripciones para manejo dinámico de validaciones
    this.login.get('dni')?.valueChanges.subscribe((value) => {
      if (value === '') {
        this.userNotFound = false;
        this.usuarioCorrecto = false;
      }
      this.actualizarEstadoCampos();
    });

    this.login.get('password')?.valueChanges.subscribe((value) => {
      if (value === '') {
        this.passwordNotFound = false;
        this.passwordCorrecta = false;
      }
      this.actualizarEstadoCampos();
    });
  }

  // Alterna la visibilidad del campo de contraseña
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  // Actualiza el estado general de los campos
  actualizarEstadoCampos(): void {
    const dni = this.login.get('dni')?.value;
    const password = this.login.get('password')?.value;

    this.camposIncompletos = !dni || !password;
  }

  // Manejo del evento de envío del formulario
  onSubmit(): void {
    // Verifica primero si los campos están completos
    this.actualizarEstadoCampos();
    if (this.camposIncompletos) {
        this.userNotFound = false;
        this.passwordNotFound = false;
        console.log('Faltan campos por completar.');
        return;
    }

    // Extraemos los valores ingresados
    const credentials = {
        dni: this.login.get('dni')?.value,
        password: this.login.get('password')?.value,
    };

    this.service.login(credentials).subscribe({
        next: (response: LoginResponse) => {
            console.log('Inicio de sesión exitoso', response);
            this.stateService.setLogin(
                response.access_token,
                response.refresh_token
            );
            this.router.navigate(['/home']);
        },
        error: (error) => {
            console.error('Error en el inicio de sesión', error);

            if (error.status === 401) {
                Swal.fire({
                    title: 'Error',
                    text: 'Usuario o contraseña incorrectos.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            } else if (error.status === 0) {
                Swal.fire({
                    title: 'Error',
                    text: 'Problema de conexión. Por favor verifica tu conexión a Internet.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'Ocurrió un error inesperado. Intenta nuevamente más tarde.',
                    icon: 'error',
                    confirmButtonText: 'Aceptar',
                });
            }
            
            this.passwordNotFound = true; 
        },
    });
}
}