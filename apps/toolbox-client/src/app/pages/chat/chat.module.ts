
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { HeaderModule } from '../../core/shell/layout/header/header.module';


@NgModule({
  declarations: [
    ChatComponent,
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    HeaderModule
  ],
  exports : [
    ChatComponent
  ],
})
export class ChatModule { }
