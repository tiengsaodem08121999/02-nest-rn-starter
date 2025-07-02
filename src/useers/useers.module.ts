import { Module } from '@nestjs/common';
import { UseersService } from './useers.service';
import { UseersController } from './useers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/useer.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: User.name,
      schema: UserSchema,}
  ])],
  controllers: [UseersController],
  providers: [UseersService],
})
export class UseersModule {}
