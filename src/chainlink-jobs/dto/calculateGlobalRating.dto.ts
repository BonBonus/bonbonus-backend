import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class DataObject {
  @IsNotEmpty()
  @IsInt()
  token: number;
}

export class CalculateGlobalRatingDto {
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => DataObject)
  data: DataObject;

  @IsNotEmpty()
  @IsString()
  id: string;
}
