import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { hashPasswordHelper } from '@/helper/util';
import aqp from 'api-query-params';
import { CreateAuthDto } from '@/auth/dto/create-auth.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '@nestjs-modules/mailer';
const dayjs = require('dayjs');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private readonly mailerService: MailerService,
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

  async handleRegister(createUserDto: CreateAuthDto) {
    // Check if email already exists
    const emailExists = await this.isEmailExist(createUserDto.email);
    if (emailExists) {
      throw new BadRequestException(`Email ${createUserDto.email} already exists`);
    }

    // Hash the password
    const hashPassword = await hashPasswordHelper(createUserDto.password);
    const codeId = uuidv4(); // Generate a unique code ID
    const { email, name, password } = createUserDto;
    const newUser = await this.userModel.create({
      email,
      name,
      codeId, // Store the unique code ID
      password: hashPassword,
      isActive: false, // Default to inactive
      codeExpired: dayjs().add(5, 'minutes'), // Set expiration time to 5 minutes from now
    });
    
    // send email verification logic here if needed
    
    this.mailerService.sendMail({
      to: newUser.email,  // Send to the user's email 
      subject: 'Activate your account',
      template: 'register.hbs', // Name of the template file without extension
      context: {
        name: newUser?.name ?? newUser.email, // Data to be passed to the template
        activationCode: codeId, // Example data
      },
    }); 

    return {
      _id: newUser._id,
    };

  }
}
