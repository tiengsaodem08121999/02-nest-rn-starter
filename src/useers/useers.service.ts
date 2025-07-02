import { Injectable } from '@nestjs/common';
import { CreateUseerDto } from './dto/create-useer.dto';
import { UpdateUseerDto } from './dto/update-useer.dto';

@Injectable()
export class UseersService {
  create(createUseerDto: CreateUseerDto) {
    return 'This action adds a new useer';
  }

  findAll() {
    return `This action returns all useers`;
  }

  findOne(id: number) {
    return `This action returns a #${id} useer`;
  }

  update(id: number, updateUseerDto: UpdateUseerDto) {
    return `This action updates a #${id} useer`;
  }

  remove(id: number) {
    return `This action removes a #${id} useer`;
  }
}
