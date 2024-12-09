import { ArgumentsHost, Catch, Controller, ExceptionFilter, HttpException, UseFilters, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './message/dto/create-message.dto';

// @Catch(HttpException)
// export class RpcValidationFilter implements ExceptionFilter {
//     catch(exception: HttpException, host: ArgumentsHost) {
//         return new RpcException(exception.getResponse())
//     }
// }


@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}


  @MessagePattern('test-chat')
  async testChat() {
    console.log('test-chat received'); 
    return [];
  }
  

  // // @UseFilters(new RpcValidationFilter())
  // @MessagePattern('create-message')
  // // async createMessage(@Payload(new ValidationPipe({ whitelist: true })) createMessageDto: CreateMessageDto) {
  // async createMessage() {
  //   console.log('create message received chat controller'); 
  // }



}