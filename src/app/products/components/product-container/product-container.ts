import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';
import { GlobalModalMessages } from '../global-modal-messages/global-modal-messages';

@Component({
  selector: 'app-product-container',
  imports: [Header, RouterOutlet, GlobalModalMessages],
  templateUrl: './product-container.html',
  styleUrl: './product-container.scss',
})
export class ProductContainer {}
