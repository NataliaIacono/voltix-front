import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../service/profile.service';
import { User } from '../../../model/user';
import { RouterLink } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

const mockUser = {
  iprofile_id: 1,
  user: 'user',
  fullname: 'Mock User',
  dni: 'Y4074276R',
  birth_date: '11/01/1986',
  email: 'mockUser@vamoEquipo',
  password: '**********',
  address: 'Calle sita 999',
  phone_number: 'phone_number',
};
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = mockUser;
  private service = inject(ProfileService);
  private location = inject(Location);

  ngOnInit(): void {
    this.service.profile().subscribe((data) => {
      console.log(data);
      this.user = data;
    });
  }
  logout(): void {
    this.service.logout();
  }
  goBack(): void {
    this.location.back();
  }
}
