import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  create(authDto: AuthDto) {
    return this.authRepository.create(authDto);
  }

  async findAll() {
    const authList = await this.authRepository.findAll();

    return authList.map((auth) => new AuthDto(auth));
  }

  findOne(id: string) {
    return this.authRepository.findById(id);
  }

  findByEmailAndPass(authDto: AuthDto) {
    return this.authRepository.findByEmailAndPass(authDto);
  }

  update(authDto: AuthDto) {
    return this.authRepository.update(authDto);
  }

  remove(id: string) {
    return `This action removes a #${id} auth`;
  }
}
