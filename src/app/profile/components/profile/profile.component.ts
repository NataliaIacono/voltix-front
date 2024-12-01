import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../service/profile.service';
import { User } from '../../../core/model/user';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user!: User;
  /* public userTest: User; */
  public profileForm: FormGroup;
  public passwordForm: FormGroup;
  public edit: Boolean = true;
  public save: Boolean = false;
  public newPasswordPage: Boolean = false;
  public profileInputs: Boolean = true;
  public currentPassword: string = '';
  public newPassword: string = '';
  public confirmPassword: string = '';

  private service = inject(ProfileService);
  private location = inject(Location);
  photo = 'https://images.pexels.com/photos/4129015/pexels-photo-4129015.jpeg';

  constructor(private fb: FormBuilder) {
    this.profileForm = this.fb.group({
      user: [],
      fullname: [{ value: '', disabled: true }],
      dni: { value: '', disabled: true },
      phone_number: [{ value: '', disabled: true }],
      address: [{ value: '', disabled: true }],
      email: [
        { value: '', disabled: true },
        [, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
      ],
      password: [{ value: '', disabled: true }, []],
    });

    this.passwordForm = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: [
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
        confirmPassword: ['', [Validators.required, this.passwordsMatch]],
      },
      {
        validators: this.passwordsMatch,
      }
    );
  }

  passwordsMatch(group: FormGroup) {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
  get email() {
    return this.profileForm.get('email');
  }

  changepassword() {
    console.log('Pasamos a cambiar contraseña');
    this.newPasswordPage = true;
    this.profileInputs = false;
  }

  enable(
    fullname: string,
    dni: string,
    phone_number: string,
    address: string,
    email: string,
    password: string
  ): void {
    this.profileForm.get(fullname)?.enable();
    this.profileForm.get(dni)?.enable();
    this.profileForm.get(phone_number)?.enable();
    this.profileForm.get(address)?.enable();
    this.profileForm.get(email)?.enable();

    this.edit = false;
    this.save = true;
  }

  //Deshabilitar campos y guardar datos
  disable(
    fullname: string,
    dni: string,
    phone_number: string,
    address: string,
    email: string,
    password: string
  ): void {
    this.profileForm.get(fullname)?.disable();
    this.profileForm.get(dni)?.disable();
    this.profileForm.get(phone_number)?.disable();
    this.profileForm.get(address)?.disable();
    this.profileForm.get(email)?.disable();

    this.edit = true;
    this.save = false;
  }

  editUser(
    fullname: string,
    dni: string,
    phone_number: string,
    address: string,
    email: string
  ) {
    console.log(fullname, dni, phone_number, address, email);
  }

  editPhoto(photo: string) {
    console.log(photo);
  }

  ngOnInit(): void {
    this.service.profile().subscribe((data) => {
      console.log(data);
      this.user = data;
    });
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
    this.location.back();
  }

  onSubmit() {
    if (this.passwordForm.valid) {
      const { currentPassword, newPassword } = this.passwordForm.value;
      console.log('Contraseña actual:', currentPassword);
      console.log('Nueva contraseña:', newPassword);
    } else {
      console.log('Formulario inválido');
    }
  }
}
