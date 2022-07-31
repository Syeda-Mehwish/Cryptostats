import {  BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException, } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserRequest } from './dto/request/create-user-request.dto';
import { hash, compare } from 'bcrypt';
import { User } from './models/User';
import { UserResponse } from './dto/response/user-response.dto';
@Injectable()
export class UsersService {

    constructor(private readonly usersRepository:UsersRepository){}
    async createUser(
        createUserRequest:CreateUserRequest,
        ): Promise<UserResponse>{
            await this.validateCreateUserRequest(createUserRequest)
        const user = await this.usersRepository.insertOne({
            ...createUserRequest,
            password: await hash(createUserRequest.password, 10),
          });
          return this.buildResponse(user);
        }

        private async validateCreateUserRequest(
            createUserRequest:CreateUserRequest,
        ): Promise<void>{
            const user = await this.usersRepository.findoneEmail(
                createUserRequest.email,
            );
            if (user){
                throw new BadRequestException("This Email Already exist");
                
            }
        }
        async validateUser(email: string, password: string): Promise<UserResponse> {
            const user = await this.usersRepository.findoneEmail(email);
            if (!user) {
              throw new NotFoundException(`User does not exist by email: '${email}'.`);
            }
            const passwordIsValid = await compare(password, user.password);
            if (!passwordIsValid) {
              throw new UnauthorizedException('Credentials are invalid');
            }
            return this.buildResponse(user);
          }

        private buildResponse(user: User): UserResponse{
            return{
                _id:user._id.toHexString(),
                email:user.email,
                
            };
        }
    }

