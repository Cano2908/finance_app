import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit {
  isScrolled = false;
  isMobileMenuOpen = false;

  isEmpresasOpen = false;
  isPeriodosOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleEmpresas() {
    this.isEmpresasOpen = !this.isEmpresasOpen;
    this.isPeriodosOpen = false; // Cierra el otro
  }

  togglePeriodos() {
    this.isPeriodosOpen = !this.isPeriodosOpen;
    this.isEmpresasOpen = false; // Cierra el otro
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.pageYOffset > 50;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu() {
    this.isMobileMenuOpen = false;
  }

  logout() {
    localStorage.removeItem('empresaId');
    localStorage.removeItem('usuarioId');

    this.router.navigate(['/']);
    alert('Cerrando sesión...');
  }
}
