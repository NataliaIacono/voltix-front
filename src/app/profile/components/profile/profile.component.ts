import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../../service/profile.service';
import { User } from '../../../model/user';
import { RouterLink } from '@angular/router';
import { FlowbiteService } from '../../../core/services/flowbite.service';

const mockUser = {
  iprofile_id: 1,
  user: 'user',
  fullname: 'Mock User',
  dni: 'Y4074276R',
  birth_date: '11/01/1986',
  email: 'mockUser@vamoEquipo',
  password: 'Noteladigo',
  address: 'Calle sita 999',
  phone_number: 'phone_number',
};
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: User = mockUser;
  constructor(
    private service: ProfileService,
    private flowBite: FlowbiteService
  ) {}

  ngOnInit(): void {
    this.service.getUser().subscribe((data) => {
      console.log(data);
    });
    console.log('OnInit not implemented.');
  }
}
