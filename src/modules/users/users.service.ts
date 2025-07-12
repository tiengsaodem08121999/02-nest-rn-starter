import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPasswordHelper } from '@/helper/util';
import aqp from 'api-query-params';
import e from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
  ) { }

  isEmailExist = async (email: string) => {
    const user = await this.userModel.findOne({ email });
    if (user) {
      return true; // Email already exists
    }
    return false; // Email does not exist
  }

  async create(createUserDto: CreateUserDto) {
    // Check if email already exists
    const emailExists = await this.isEmailExist(createUserDto.email);
    if (emailExists) {
      throw new BadRequestException(`Email ${createUserDto.email} already exists`);
    }

    // Hash the password
    const hashPassword = await hashPasswordHelper(createUserDto.password);
    const { email, name, password, phone, address, image } = createUserDto;
    const newUser = await this.userModel.create({
      email,
      name,
      phone,
      password: hashPassword,
      address,
      image,
    });
    return {
      _id: newUser._id,
    };
  }

  async findAll(query: string, current: number, pageSize: number) {
    if (!current) {
      current = 1; // Default to page 1 if not provided
    }

    if (!pageSize) {
      pageSize = 10; // Default to 10 items per page if not provided
    }
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;

    const totalItems = (await this.userModel.find(filter)).length || 0;
    const totalPage = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;


    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .select('-password'); // Exclude password from the result;

    return { results, totalItems, totalPage, current, pageSize };
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.userModel.deleteOne({ _id});
    } else {
      throw new BadRequestException('Invalid user ID format');
    }
  }
}
