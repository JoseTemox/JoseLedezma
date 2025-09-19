import { Component } from '@angular/core';
import { Header } from '../header/header';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-product-container',
  imports: [Header, RouterOutlet],
  templateUrl: './product-container.html',
  styleUrl: './product-container.scss',
})
export class ProductContainer {}
