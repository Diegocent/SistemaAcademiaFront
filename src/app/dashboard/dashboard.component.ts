import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/usuario", title: "Agregar Alumna", icon: "person", class: "" },
  {
    path: "/modificar_alumna",
    title: "Modificar alumna",
    icon: "manage_accounts",
    class: "",
  },
  {
    path: "/pantalla_cobro",
    title: "Pantalla Cobro",
    icon: "library_books",
    class: "",
  },
  {
    path: "/informe_diario",
    title: "Informe diario",
    icon: "leaderboard",
    class: "",
  },
  {
    path: "/informe_fechas",
    title: "Informe por fechas",
    icon: "assessment",
    class: "",
  },
  {
    path: "/configuracion",
    title: "Configuracion",
    icon: "assessment",
    class: "",
  },
];
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  menuItems: any[];

  constructor() {}
  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
