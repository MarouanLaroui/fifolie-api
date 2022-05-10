import { IsNumber, IsString } from 'class-validator';

export class CreateActionDto {
  @IsString()
  name: string;

  @IsNumber()
  maxValue: number;
}
