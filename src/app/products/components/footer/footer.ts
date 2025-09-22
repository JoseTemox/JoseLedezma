import { Component, inject, OnInit, signal } from '@angular/core';
import packageInfo from '../../../../../package.json';
import { Router } from '@angular/router';
import { UrlFront } from '../../shared/globals-definitions/url-const';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer implements OnInit {
  private readonly router = inject(Router);
  public showBack = signal(false);
  public goBack = signal<UrlFront | string>(UrlFront.Home);
  version: string = packageInfo.version;
  developerEmail: string = `${packageInfo.author.email}`;
  developerName: string = `${packageInfo.author.name}`;
  url: string = `${packageInfo.author.url}`;

  ngOnInit(): void {
    if (
      this.router.url.includes(UrlFront.NewProduct) ||
      this.router.url.includes(UrlFront.EditProduct) ||
      this.router.url.includes(UrlFront.ManageProduct)
    ) {
      this.showBack.set(true);
    } else {
      this.showBack.set(false);
    }

    if (
      this.router.url.includes(UrlFront.NewProduct) ||
      this.router.url.includes(UrlFront.EditProduct)
    ) {
      this.goBack.set(UrlFront.ManageProduct);
    } else {
      this.goBack.set(UrlFront.Home);
    }
  }
  navigateToLeft(): void {
    this.router.navigate([this.goBack()]);
  }

  navigateToRight(): void {
    this.router.navigate([UrlFront.ManageProduct]);
  }
}
