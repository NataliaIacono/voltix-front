import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../service/profile.service';
import { User } from '../../../core/model/user';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = {
    address: '',
    birth_date: '',
    phone_number: '',
    photo: '',
    email: '',
    fullname: '',
    dni: '',
  };

  originalUser!: User;
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public photoForm: FormGroup;
  public edit: Boolean = true;
  public save: Boolean = false;
  public newPasswordPage: Boolean = false;
  public profileInputs: Boolean = true;
  public current_password: string = '';
  public new_password: string = '';
  public confirm_new_password: string = '';
  public selectedFile: File | null = null;
  public previewUrl: string | null = null;
  public modalProfileOpen = false;
  public modalPasswordOpen = false;
  file: File | null = null;

  private service = inject(ProfileService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      phone_number: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      birth_date: [{ value: '', disabled: true }],
    });

    this.passwordForm = this.fb.group(
      {
        current_password: ['', [Validators.required]],
        new_password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(15),
            Validators.pattern(
              '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.,-])[A-Za-z\\d@$!%*?&#.,-]{8,15}$'
            ),
          ],
        ],
        confirm_new_password: ['', [Validators.required, this.passwordsMatch]],
      },
      {
        validators: this.passwordsMatch,
      }
    );

    this.photoForm = this.fb.group({
      photo: [null],
    });
  }
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  enable(phone_number: string, address: string, birth_date: string): void {
    this.profileForm.get(phone_number)?.enable();
    this.profileForm.get(address)?.enable();
    this.profileForm.get(birth_date)?.enable();
    this.edit = false;
    this.save = true;
  }

  //Deshabilitar campos y guardar datos
  disable(phone_number: string, address: string, birth_date: string): void {
    this.profileForm.get(phone_number)?.disable();
    this.profileForm.get(address)?.disable();
    this.profileForm.get(birth_date)?.disable();

    this.edit = true;
    this.save = false;
  }
  ngOnInit(): void {
    this.service.profile().subscribe((data) => {
      this.user = data;
      this.originalUser = { ...data };
    });
  }
  saveUser() {
    const updatedUser: Partial<User> = {};

    if (this.profileForm.get('phone_number')?.dirty) {
      updatedUser.phone_number = this.profileForm.get('phone_number')?.value;
    } else {
      updatedUser.phone_number = this.originalUser.phone_number;
    }

    if (this.profileForm.get('address')?.dirty) {
      updatedUser.address = this.profileForm.get('address')?.value;
    } else {
      updatedUser.address = this.originalUser.address;
    }

    if (this.profileForm.get('birth_date')?.dirty) {
      updatedUser.birth_date = this.profileForm.get('birth_date')?.value;
    } else {
      updatedUser.birth_date = this.originalUser.birth_date;
    }
    this.service.editUser(updatedUser).subscribe({
      next: () => {
        this.closeModalProfile();
        this.ngOnInit();
      },
      error: (error) => {
        console.error('Error:', error);
      },
    });
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { current_password, new_password, confirm_new_password } =
        this.passwordForm.value;

      this.service
        .editPassword(current_password, new_password, confirm_new_password)
        .subscribe({
          next: (res) => this.showSuccessAlert(),
          error: (error) => {
            console.error('Error:', error), this.showErrorAlert();
          },
        });
      this.closeModalPassword();
      this.profileInputs = true;
      this.newPasswordPage = false;
    } else {
      console.error('Inválido');
    }
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      this.photoForm.patchValue({ photo: file });
      this.uploadPhoto(file);
    }
  }

  uploadPhoto(file: File): void {
    this.service.uploadPhoto(file).subscribe({
      next: (response) => {
        if (response.photo_url) {
          this.user.photo = response.photo_url;
        }
      },
      error: (error) => {
        console.error('Error al subir la foto', error);
        this.showErrorPhotoAlert();
      },
    });
  }

  openModalProfile() {
    this.modalProfileOpen = true;
  }
  closeModalProfile() {
    this.modalProfileOpen = false;
  }
  openModalPassword() {
    this.modalPasswordOpen = true;
  }
  closeModalPassword() {
    this.modalPasswordOpen = false;
  }

  changepassword() {
    this.newPasswordPage = true;
    this.profileInputs = false;
  }

  passwordsMatch(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  getPhonePlaceholder(): string {
    return this.user.phone_number ? this.user.phone_number : '';
  }
  getAdressPlaceholder(): string {
    return this.user.address ? this.user.address : '';
  }
  logout(): void {
    this.service.logout();
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }

  showSuccessAlert() {
    Swal.fire({
      title: 'Actualizado correctamente',
      text: 'Actualiza el sitio para ver los cambios.',
      icon: 'success',
      confirmButtonText: 'Aceptar',
      position: 'top-end',
      width: 500,
    });
  }
  showErrorAlert() {
    Swal.fire({
      title: 'La contraseña actual no coincide',
      text: 'Actualiza el sitio para ver los cambios.',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      position: 'top-end',
      width: 600,
    });
  }
  showErrorPhotoAlert() {
    Swal.fire({
      title: 'Error en cargar la foto',
      text: 'OOPS! Algo salió mal!',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      position: 'top',
      width: 300,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
