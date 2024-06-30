import { Directive, ElementRef, Renderer2, HostListener, Input } from '@angular/core'

@Directive({
  selector: '[mouseOnHover]',
})
export class MouseOnHoverDirective {
  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  @Input() defaultColor

  @HostListener('mouseenter') mouseenter() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', this.defaultColor)
  }

  @HostListener('mouseleave') mouseleave() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'background-color', 'transparent')
  }
}
