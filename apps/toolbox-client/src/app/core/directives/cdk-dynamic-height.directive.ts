import { Directive, ElementRef, AfterViewInit, OnDestroy, Input } from '@angular/core';

@Directive({
 standalone: true,
 selector: '[appCdkDynamicHeightDir]'
})
export class CdkDynamicHeightDirective implements AfterViewInit, OnDestroy {
 @Input() appCdkDynamicHeightDir: { height: number } | undefined;
 private resizeObserver: ResizeObserver | undefined;

 constructor(private elementRef: ElementRef) { }

 ngAfterViewInit() {
     this.resizeObserver = new ResizeObserver(entries => {
         for (const entry of entries) {
             if (this.appCdkDynamicHeightDir && entry.contentRect.height !== this.appCdkDynamicHeightDir.height) {
                 this.appCdkDynamicHeightDir.height = entry.contentRect.height;
             }
         }
     });
     this.resizeObserver.observe(this.elementRef.nativeElement);
 }

 ngOnDestroy() {
     if (this.resizeObserver) {
         this.resizeObserver.disconnect();
     }
 }
}