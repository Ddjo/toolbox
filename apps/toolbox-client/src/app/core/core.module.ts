import { NgModule, Optional, SkipSelf } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { EnsureModuleLoadedOnceGuard } from "@core/guards/ensure-module-loaded-once.guard";
import { LayoutModule } from "@core/shell/layout/layout.module";
import { PreloadModulesStrategy } from "@core/strategies/preload-modules.strategy";

@NgModule({
    imports: [
        LayoutModule,
    ],
    exports: [
        BrowserModule,
        LayoutModule,
    ],
    providers: [
        PreloadModulesStrategy,
    ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
    // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
    constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        super(parentModule);
    }
}
