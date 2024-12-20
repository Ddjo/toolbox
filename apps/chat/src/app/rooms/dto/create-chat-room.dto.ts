import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { UserWithoutPasswordDto } from '../../message/dto/user-without-password.dto';

export class CreateChatRoomDto {

    @IsNotEmpty()
    @Type(() => UserWithoutPasswordDto)
    @ValidateNested()
    readonly creator: UserWithoutPasswordDto;

    @IsNotEmpty()
    @Type(() => UserWithoutPasswordDto)
    @ValidateNested()
    readonly withUser: UserWithoutPasswordDto;

}
