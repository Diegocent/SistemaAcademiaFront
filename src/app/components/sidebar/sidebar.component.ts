import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/usuario', title: 'Agregar Alumna',  icon:'person', class: '' },
    { path: '/table-list', title: 'Modificar alumna',  icon:'manage_accounts', class: '' },
    { path: '/typography', title: 'Pantalla Cobro',  icon:'library_books', class: '' },
    { path: '/icons', title: 'Informe diario',  icon:'leaderboard', class: '' },
    { path: '/maps', title: 'Informe por fechas',  icon:'assessment', class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };
}
