import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { HomeComponent } from './auth/components/home/home.component';
import { ProfileComponent } from './profile/components/profile/profile.component';
import { ForgotPasswordComponent } from './auth/components/forgot-password/forgot-password.component';
import { NewPasswordComponent } from './auth/components/new-password/new-password.component';
import { ProfileSettingsComponent } from './profile/components/profile-settings/profile-settings.component';
import { RegisterComponent } from './auth/components/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    title: 'My Home Page',
    component: HomeComponent,
  },
  {
    path: 'login',
    title: 'My Login Page',
    component: LoginComponent,
  },
  {
    path: 'profile',
    title: 'My Profile Page',
    component: ProfileComponent,
  },
  {
    path: 'profile-settings',
    title: 'Profile Settings',
    component: ProfileSettingsComponent,
  },
  {
    path: 'forgot-password',
    title: 'Forgot Password Page',
    component: ForgotPasswordComponent,
  },
  {
    path: 'new-password',
    title: 'New Password Page',
    component: NewPasswordComponent,
  },
  {
    path: 'register',
    title: 'User Register',
    component: RegisterComponent,
  },
];
