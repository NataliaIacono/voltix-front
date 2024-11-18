import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  isPasswordVisible: boolean = false;
  isRepeatPasswordVisible: boolean = false;
  registerForm: FormGroup;
  repeatPasswordTouched: boolean = false;
  errorPasswordCheck: string = '';
  errorPassword: string = '';
  passwordTouched: boolean = false;
  errorFieldsEmpty: string = '';
  errorEmail: string = '';
  hasUpperCase: boolean = false;
  hasLowerCase: boolean = false;
  hasNumber: boolean = false;
  hasSpecialChar: boolean = false;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      fullname: ['', Validators.required],
      email: ['', Validators.required],
      usuario: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      terms: [false, Validators.requiredTrue]
    });
  }

  checkEmptyFields(): void {
    this.errorFieldsEmpty = '';
    for (const control in this.registerForm.controls) {
      if (this.registerForm.controls[control].invalid && this.registerForm.controls[control].touched) {
        this.errorFieldsEmpty = '¡Error! Todos los campos son obligatorios.';
        break;
      }
    }
  }

  // Llama a este método en cada input
  onInputChange(): void {
    this.checkEmptyFields();
  }


  isEmailValid(): boolean {
    const email = this.registerForm.value.email;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  isPasswordValid(): boolean {
    const password = this.registerForm.value.password;
    const minLength = 8;
    const maxLength = 15;
    this.hasUpperCase = /[A-Z]/.test(password);
    this.hasLowerCase = /[a-z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return password.length >= minLength && password.length <= maxLength && this.hasUpperCase && this.hasLowerCase && this.hasNumber && this.hasSpecialChar;
  }

  passwordsMatch(): boolean {
    return this.registerForm.value.password === this.registerForm.value.repeatPassword;
  }
  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  toggleRepeatPasswordVisibility() {
    this.isRepeatPasswordVisible = !this.isRepeatPasswordVisible;
  }

  isAllInputsValid(): boolean {
    return (this.registerForm.get('fullname')?.valid ?? false) &&
      (this.registerForm.get('email')?.valid ?? false) &&
      (this.registerForm.get('usuario')?.valid ?? false) &&
      this.isPasswordValid() &&
      this.passwordsMatch();
  }

  onSubmit() {
    // Resetea los errores al inicio
    this.errorPassword = '';
    this.errorPasswordCheck = '';
    this.errorFieldsEmpty = '';
    this.errorEmail = '';

    console.log(this.registerForm);

    if (this.registerForm.invalid) {
      this.checkEmptyFields(); // Verifica si hay campos vacíos
      return;
    }

    if (!this.isEmailValid()) {
      this.errorEmail = '¡Error! El email no es válido.';
      return;
    }

    if (!this.isPasswordValid()) {
      this.errorPassword = '¡Error! La contraseña no cumple con los requisitos.';
      return;
    }

    if (!this.passwordsMatch()) {
      this.errorPasswordCheck = '¡Error! Las contraseñas no coinciden.';
    } else {
      this.errorPasswordCheck = ''; // Limpiar el error si las contraseñas coinciden
    }

    // Aquí puedes continuar con el registro 

    this.registerForm.reset();

  }
}