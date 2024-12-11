import { CHAT_MESSAGE_CREATE_MESSAGE } from '@constants';
import { ArgumentsHost, Catch, Controller, ExceptionFilter, HttpException, UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageService } from './message.service';


@Catch(HttpException)
export class RpcValidationFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        return new RpcException(exception.getResponse())
    }
}

@UsePipes(new ValidationPipe())
@Controller()
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @UseFilters(new RpcValidationFilter())
  @MessagePattern(CHAT_MESSAGE_CREATE_MESSAGE)
  async createMessage(@Payload() createMessageDto: CreateMessageDto) {
    return this.messageService.create(createMessageDto);
  }


}