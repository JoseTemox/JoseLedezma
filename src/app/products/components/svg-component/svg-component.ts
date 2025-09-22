import { Component, input } from '@angular/core';
import { TypeSvg } from './svg-globals.interfaces';

@Component({
  selector: 'app-svg-component',
  imports: [],
  templateUrl: './svg-component.html',
  styleUrl: './svg-component.scss',
})
export class SvgComponent {
  svgType = input<TypeSvg>(TypeSvg.Info);
  TypeSvg = TypeSvg;
  width = input<number>(15);
  height = input<number>(15);
}
