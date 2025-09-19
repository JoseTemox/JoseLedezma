import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-product-drop-down-menu',
  imports: [],
  templateUrl: './product-drop-down-menu.html',
  styleUrl: './product-drop-down-menu.scss',
})
export class ProductDropDownMenu implements OnInit {
  // Variable para controlar si el menú está abierto o cerrado
  public isDropdownOpen: boolean = false;

  // ✅ Usar HostListener para manejar clicks globales
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as Element;

    // Si se hace clic en el botón toggle
    // if (targetElement.matches('.dropdown-toggle')) {
    //   this.isDropdownOpen = !this.isDropdownOpen;
    //   return;
    // }

    // Si se hace clic fuera del dropdown, cerrarlo
    if (!targetElement.closest('.dropdown-container')) {
      this.isDropdownOpen = false;
    }
  }
  ngOnInit(): void {}

  public dropdownList = [
    {
      label: 'Editar',
      value: 'edit',
    },
    {
      label: 'Eliminar',
      value: 'delete',
    },
  ];

  // Función para cambiar el estado del dropdown
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  // Función para manejar la selección de una opción
  selectOption(option: string) {
    console.log('Opción seleccionada:', option);
    // Aquí puedes agregar la lógica que necesites para la opción seleccionada.
    this.isDropdownOpen = false; // Cierra el menú después de seleccionar
  }
}
