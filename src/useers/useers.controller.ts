import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UseersService } from './useers.service';
import { CreateUseerDto } from './dto/create-useer.dto';
import { UpdateUseerDto } from './dto/update-useer.dto';

@Controller('useers')
export class UseersController {
  constructor(private readonly useersService: UseersService) {}

  @Post()
  create(@Body() createUseerDto: CreateUseerDto) {
    return this.useersService.create(createUseerDto);
  }

  @Get()
  findAll() {
    return this.useersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.useersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUseerDto: UpdateUseerDto) {
    return this.useersService.update(+id, updateUseerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.useersService.remove(+id);
  }
}
