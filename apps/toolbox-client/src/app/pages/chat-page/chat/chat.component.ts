import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '@toolbox-client/src/app/core/services/chat.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      FormsModule,
      ReactiveFormsModule,
      ButtonModule,
      CardModule,
      InputTextModule
    ]
})
export class ChatComponent implements OnDestroy {


  messageContent = new FormControl<string | undefined>(undefined);
    
  constructor(private chatService: ChatService) {}
  
  ngOnDestroy(): void {
    this.chatService.disconnect();
  }
  
  testChat() {
    this.chatService.emit('test-chat')
  }
  
  sendMessage() {
    this.chatService.sendMessage('id-test', this.messageContent.getRawValue() as string);
  }
 }
