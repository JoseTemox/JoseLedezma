import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  HostListener,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngIf
import { Subscription } from 'rxjs';
import { DropdownMenuService } from './drop-down-menu.service';
import { Product } from '../../interfaces/products.interfaces';

@Component({
  selector: 'app-drop-down-menu',
  imports: [],
  templateUrl: './drop-down-menu.html',
  styleUrl: './drop-down-menu.scss',
})
export class DropDownMenu {
  @Input() product: Product | undefined; // ID del registro asociado, para saber qué eliminar/editar
  @Output() edit = new EventEmitter<Product>();
  @Output() delete = new EventEmitter<Product>();

  isOpen = false;
  private dropdownSubscription!: Subscription;
  private uniqueId: string; // Para identificar esta instancia del dropdown

  constructor(
    private dropdownService: DropdownMenuService,
    private elementRef: ElementRef // Para detectar clics fuera del componente
  ) {
    // Generar un ID único para cada instancia del componente
    this.uniqueId = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
  }

  ngOnInit(): void {
    // Suscribirse al servicio para cerrar otros dropdowns
    this.dropdownSubscription =
      this.dropdownService.closeAllDropdowns$.subscribe(
        (idToExclude: string | null) => {
          if (this.isOpen && this.uniqueId !== idToExclude) {
            this.isOpen = false; // Cerrar si no es el dropdown que se está abriendo/interactuando
          }
        }
      );
  }

  ngOnDestroy(): void {
    if (this.dropdownSubscription) {
      this.dropdownSubscription.unsubscribe();
    }
  }

  // Escucha clics en el documento para cerrar el dropdown si el clic es fuera
  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation(); // Evitar que el clic se propague y cierre el dropdown inmediatamente
    if (this.isOpen) {
      // Si ya está abierto y se hace clic en el botón de nuevo, simplemente ciérralo
      this.isOpen = false;
    } else {
      // Si está cerrado, notificar al servicio para cerrar otros y luego abrir este
      this.dropdownService.requestCloseAll(this.uniqueId);
      this.isOpen = true;
    }
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.product);
    this.isOpen = false; // Cerrar después de la acción
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.product);
    this.isOpen = false; // Cerrar después de la acción
  }
}
