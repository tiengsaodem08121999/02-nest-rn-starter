import { PartialType } from '@nestjs/mapped-types';
import { CreateUseerDto } from './create-useer.dto';

export class UpdateUseerDto extends PartialType(CreateUseerDto) {}
