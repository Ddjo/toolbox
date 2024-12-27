import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, ValidateNested } from "class-validator";
import { UserWithoutPasswordDto } from "./user-without-password.dto";

export class ChatMessageViewDto {
    @IsNotEmpty()
    @Type(() => UserWithoutPasswordDto)
    @ValidateNested()
    readonly user: UserWithoutPasswordDto;

    @IsDate()
    @Type(() => Date)
    readonly viewedAt: Date;
}