import { UserDto } from '@libs/common';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

export class GetAllChatRoomsForUserDto {

    @IsNotEmpty()
    @Type(() => UserDto)
    @ValidateNested()
    readonly user: UserDto;
    
    @IsNumber()
    readonly messagesLimit: number;

}
