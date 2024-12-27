import { Directive, ElementRef, EventEmitter, Input, Output, OnDestroy, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appVisibilityObserver]'
})
export class VisibilityObserverDirective implements AfterViewInit, OnDestroy {
  @Output() visibilityChange = new EventEmitter<boolean>(); // Emits whether the element is visible
  @Input() visibilityObsoptions: IntersectionObserverInit = {}; // Allow custom IntersectionObserver options

  private observer: IntersectionObserver | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit(): void {
    this.initializeObserver();
  }

  private initializeObserver() {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          this.visibilityChange.emit(entry.isIntersecting);
        });
      }, this.visibilityObsoptions);

      this.observer.observe(this.el.nativeElement);
    } else {
      // Fallback for older browsers
      console.warn('IntersectionObserver is not supported by this browser.');
    }
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
