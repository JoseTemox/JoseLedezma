import {
  Component,
  HostListener,
  ElementRef,
  input,
  output,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DropdownMenuService } from './drop-down-menu.service';
import { Product } from '../../interfaces/products.interfaces';

@Component({
  selector: 'app-drop-down-menu',
  imports: [],
  templateUrl: './drop-down-menu.html',
  styleUrl: './drop-down-menu.scss',
})
export class DropDownMenu implements OnInit, OnDestroy {
  private readonly dropdownService = inject(DropdownMenuService);
  private readonly elementRef = inject(ElementRef);
  product = input<Product | undefined>();
  edit = output<Product | undefined>();
  delete = output<Product | undefined>();

  isOpen = false;
  private uniqueId: string;
  private readonly onDestroy$ = new Subject<void>();

  constructor() {
    this.uniqueId = `dropdown-${Math.random().toString(36).substring(2, 9)}`;
  }

  ngOnInit(): void {
    this.dropdownService.closeAllDropdowns$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((idToExclude: string | null) => {
        if (this.isOpen && this.uniqueId !== idToExclude) {
          this.isOpen = false;
        }
      });
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  clickout(event: Event): void {
    if (this.isOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  toggleDropdown(event: Event): void {
    event.stopPropagation();
    if (this.isOpen) {
      this.isOpen = false;
    } else {
      this.dropdownService.requestCloseAll(this.uniqueId);
      this.isOpen = true;
    }
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.product());
    this.isOpen = false;
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.product());
    this.isOpen = false;
  }
}
