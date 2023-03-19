import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DataObject {
  @IsNotEmpty()
  @IsInt()
  provider: number;

  @IsNotEmpty()
  @IsInt()
  token: number;
}

export class CalculateTokenRatingDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DataObject)
  data: DataObject;

  @IsNotEmpty()
  @IsString()
  id: string;
}
