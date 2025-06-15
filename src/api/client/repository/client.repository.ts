import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Auth } from 'src/models/auth.model';

import { convertDateToTimestamp } from 'src/api/utils/utils';

import { CreateClientDto } from '../dto/create-client.dto';
import { UpdateClientDto } from '../dto/update-client.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ClientRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   'SELECT c.*, a.email FROM client c inner join auth a on c.idAuth = a.id where c.id = ?',
      //   [id],
      // );

      const { data, error } = await this.supabase
        .from('client')
        .select(`*, auth: idAuth (email, pass)`)
        .eq('id', id)
        .single();

      if (error) throw error;
      // “auth” vem como um objeto { email }, trazemos para o mesmo nível:
      return {
        ...data,
        email: data.auth?.email ?? null,
        pass: data.auth?.pass ?? null,
      };
    } catch (error) {
      throw error;
    }
  }

  async findAll(idCompany: string, isAdmin = false): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   'SELECT c.*, a.email FROM client c inner join auth a on c.idAuth = a.id and a.isAdmin = 0 where c.idCompany = ?',
      //   [idCompany],
      // );
      const { data, error } = await this.supabase
        .from('client')
        .select(`*, auth!inner (email, isAdmin)`)
        .eq('idCompany', idCompany)
        .eq('auth.isAdmin', isAdmin);

      if (error) throw error;
      return data.map((c) => ({
        ...c,
        email: c.auth?.email ?? null,
      }));
    } catch (error) {
      throw error;
    }
  }

  async create(createClientDto: CreateClientDto, auth: Auth): Promise<any> {
    // const createQuery = 'insert into client (name, birthday, phone, gender, idCompany, idAuth) values (?,?,?,?,?,?);';
    //
    // await this.databaseService.execute(createQuery, [
    //   createClientDto.name,
    //   convertDateToTimestamp(new Date(createClientDto.birthday)),
    //   createClientDto.phone,
    //   createClientDto.gender,
    //   createClientDto.idCompany,
    //   auth.id,
    // ]);
    const birthdayTs = convertDateToTimestamp(
      new Date(createClientDto.birthday),
    );
    const { data, error } = await this.supabase
      .from('client')
      .insert([
        {
          name: createClientDto.name,
          birthday: birthdayTs,
          phone: createClientDto.phone,
          gender: createClientDto.gender,
          idCompany: createClientDto.idCompany,
          idAuth: auth.id,
        },
      ])
      .select('*')
      .single();

    if (error) throw error;
    return data;
  }

  async update(
    idClient: string,
    updateClientDto: UpdateClientDto,
  ): Promise<void> {
    try {
      // await this.databaseService.execute(
      //   'UPDATE client SET name = ?, birthday = ?, phone = ?, gender = ?, photoUrl = ?, isActive = ? WHERE id = ?',
      //   [
      //     updateClientDto.name,
      //     convertDateToTimestamp(new Date(updateClientDto.birthday)),
      //     updateClientDto.phone,
      //     updateClientDto.gender,
      //     updateClientDto.photoUrl,
      //     updateClientDto.isActive ? 1 : 0,
      //     idClient,
      //   ],
      // );
      const birthdayTs = convertDateToTimestamp(
        new Date(updateClientDto.birthday),
      );
      const { error } = await this.supabase
        .from('client')
        .update({
          name: updateClientDto.name,
          birthday: birthdayTs,
          phone: updateClientDto.phone,
          gender: updateClientDto.gender,
          photoUrl: updateClientDto.photoUrl,
          isActive: updateClientDto.isActive,
        })
        .eq('id', idClient);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async updateIdSupabaseAuth(
    idClient: string,
    idSupabaseAuth: string,
  ): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('client')
        .update({ idSupabaseAuth: idSupabaseAuth })
        .eq('id', idClient);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}
