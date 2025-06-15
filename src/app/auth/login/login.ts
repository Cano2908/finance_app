import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { APIResponse } from '../../core/models/response-api';
import { User } from '../../core/models/user-response';

@Component({
  selector: 'app-login',
  imports: [RouterOutlet, FormsModule, CommonModule],
  templateUrl: './login.html',
})
export class Login implements OnInit {
  isLoggedIn: boolean = false;

  username: string = '';
  password: string = '';
  showPassword: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {}

  login() {
    console.log(
      'Login attempt with username:',
      this.username,
      'and password:',
      this.password
    );
    this.authService.login(this.username, this.password).subscribe({
      next: (response: APIResponse<User>) => {
        console.log('Login response:', response);

        if (response.data) {
          this.isLoggedIn = true;
          alert(
            'Usuario Autenticado correctamente, bienvenido ' +
              response.data.nom_usuario
          );
          localStorage.setItem('usuarioId', JSON.stringify(response.data._id));
          this.router.navigate(['empresa/listar-empresas']);
        } else {
          alert('Login failed: ' + response.detail);
        }
      },
      error: (error) => {
        if (error.status === 404) {
          alert(
            'Credenciales incorrectas. Por favor verifique e inténtelo de nuevo.'
          );
        } else {
          console.error('Error during login:', error);
          alert(
            'Ocurrió un error al intentar iniciar sesión. Por favor, inténtelo más tarde.'
          );
        }
      },
    });
  }
}
