import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateChatDto {
  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty.' })
  @MaxLength(2000, { message: 'Message cannot be longer than 2000 characters.' })
  message: string;
}