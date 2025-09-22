import { Component } from '@angular/core';
import { SvgComponent } from '../svg-component/svg-component';
import { TypeSvg } from '../svg-component/svg-globals.interfaces';

@Component({
  selector: 'app-header',
  imports: [SvgComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  TypeSvg = TypeSvg;
}
