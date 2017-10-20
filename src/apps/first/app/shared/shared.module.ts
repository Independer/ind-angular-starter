import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    HttpModule
  ],
  exports: [
    CommonModule,
    HttpModule
  ],
  declarations: [],
  providers: []
})
export class SharedModule {
}
