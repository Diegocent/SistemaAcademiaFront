import { Component, OnInit, HostListener } from "@angular/core";

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
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isMobile = false;

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.checkWindowSize();
  }

  @HostListener("window:resize", ["$event"])
  onResize(event: any) {
    this.checkWindowSize();
  }

  checkWindowSize() {
    this.isMobile = window.innerWidth <= 991;
  }
}
