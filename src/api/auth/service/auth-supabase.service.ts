// src/supabase/supabase.service.ts
import { Injectable } from '@nestjs/common';
import { AuthSupabaseRepository } from '../repository/auth-supabase.repository';
import { ClientRepository } from '../../client/repository/client.repository';
import { User } from '@supabase/supabase-js';
import {
  CreateSupabaseUserDto,
  UpdateSupabaseUserDto,
} from '../dto/request/create-user.dto';
import { AppAuthDto } from '../dto/request/app-auth.dto';

@Injectable()
export class AuthSupabaseService {
  constructor(
    private readonly repository: AuthSupabaseRepository,
    private readonly clientRepository: ClientRepository,
  ) {}

  async findAllUsers() {
    return this.repository.findAllUsers();
  }

  async appAuth(auth: AppAuthDto) {
    try {
      const data = await this.repository.loginUser(
        auth.email,
        Buffer.from(auth.password, 'base64').toString('utf-8'),
      );

      return data.session.access_token;
    } catch (error) {
      console.error('Error during app authentication:', error);
      throw error;
    }
  }

  async findUserById(userId: string) {
    const { data, error } = await this.repository.findUserById(userId);
    if (error) throw error;
    return data;
  }

  async toggleUserAccess(userId: string, enabled: boolean) {
    const { data, error } = await this.repository.toggleUserAccess(
      userId,
      enabled,
    );
    if (error) throw error;
    return data;
  }

  async deleteUser(supabaseAuthId: string, clientId: string) {
    await this.clientRepository.updateIdSupabaseAuth(clientId, null);

    const { data, error } = await this.repository.deleteUser(supabaseAuthId);

    if (error) throw error;
    return data;
  }

  async updatePassword(idClient: string, newPass: string) {
    // get client
    const client = await this.clientRepository.findById(idClient);

    // check if client exists
    if (!client) {
      throw new Error(`Client with ID ${idClient} not found`);
    }

    // update password in supabase auth
    const { error } = await this.repository.updatePassword(
      client.idSupabaseAuth,
      Buffer.from(newPass, 'base64').toString('utf-8'),
    );

    if (error) {
      console.warn(
        `❌ Failed to update password for client ${client.id}:`,
        error.message,
      );
      throw error;
    }

    return { status: 'success' };
  }

  async createUser(userDto: CreateSupabaseUserDto) {
    // get client
    const client = await this.clientRepository.findById(
      userDto.userMetadata.clientId,
    );

    // check if client exists
    if (!client) {
      throw new Error(
        `Client with ID ${userDto.userMetadata.clientId} not found`,
      );
    }

    // check if client has supabaseAuthId
    // if it has, delete the supabaseAuth to creae a new one
    if (client.idSupabaseAuth) {
      try {
        await this.deleteUser(client.idSupabaseAuth, client.id);
      } catch (err) {
        console.error(
          `Failed to delete existing user for client ${client.id}:`,
          err,
        );
        throw err;
      }
    }

    // verificar se o email ja está cadastrado no supabaseAuth
    const existingUsers = await this.repository.findAllUsers();
    const userExists = existingUsers.some(
      (user) => user.email === userDto.email,
    );

    // se ainda existir email cadastrado, é pq estamos duplicando o email para outro user
    if (userExists) {
      const existingUser = existingUsers.find(
        (user) => user.email === userDto.email,
      );
      if (existingUser && existingUser.user_metadata?.clientId === client.id) {
        // se o email já existe mas é do mesmo client, então deleta o existente e cria um novo
        await this.deleteUser(existingUser.id, client.id);
      } else {
        throw new Error(
          `User with email ${userDto.email} already exists to another client`,
        );
      }
    }

    userDto.password = Buffer.from(client.pass, 'base64').toString('utf-8');
    userDto.userMetadata.clientIdAuth = client.idAuth;

    // finalmente cria o supabase auth user
    const { data, error } = await this.repository.createUser(userDto);

    if (error) {
      console.warn(
        `❌ Failed to create supabase user for client ${client.id}:`,
        error.message,
      );
      throw error;
    }

    // atualiza o idSupabaseAuth do client
    await this.clientRepository.updateIdSupabaseAuth(client.id, data.user.id);

    return { status: 'success' };
  }

  async updateUser(userDto: UpdateSupabaseUserDto) {
    // get client
    const client = await this.clientRepository.findById(
      userDto.userMetadata.clientId,
    );

    // check if client exists
    if (!client) {
      throw new Error(
        `Client with ID ${userDto.userMetadata.clientId} not found`,
      );
    }

    // verificar se o email ja está cadastrado no supabaseAuth para outro user
    const existingUsers = await this.repository.findAllUsers();
    const existsOtherUserWithSameEmail = existingUsers.some(
      (user) =>
        user.email === userDto.email && user.id !== userDto.idSupabaseAuth,
    );

    // se ainda existir email cadastrado, é pq estamos duplicando o email para outro user
    if (existsOtherUserWithSameEmail) {
      throw new Error(
        `User with email ${userDto.email} already exists to another client`,
      );
    }

    // finalmente cria o supabase auth user
    const { data, error } = await this.repository.updateUser(userDto);

    if (error) {
      console.warn(
        `❌ Failed to update supabase user for client ${client.id}:`,
        error.message,
      );
      throw error;
    }

    return { status: 'success' };
  }

  /**
   * @deprecated do not use this method
   */
  async deleteAllUsers(isAdmin: boolean): Promise<void> {
    const allAuthUsers = await this.findAllUsers();

    for (const supabaseUser of allAuthUsers) {
      if (supabaseUser.role === 'user') {
        const { data, error } = await this.repository.deleteUser(
          supabaseUser.id,
        );
      }
    }

    const allClients = await this.clientRepository.findAll(
      '7fa9293c-3700-11ee-ba6d-9d20c6833ca2',
      false,
    );

    for (const client of allClients) {
      if (client.idSupabaseAuth) {
        try {
          await this.clientRepository.updateIdSupabaseAuth(client.id, null);
        } catch (err) {
          console.error(
            `Failed to delete existing user for client ${client.id}:`,
            err,
          );
        }
      }
    }

    // if (!allAuthUsers.length) {
    //   console.log('No users found to delete');
    //   return;
    // }
    //
    // const userTasks = allAuthUsers.map(async (user) => {
    //   try {
    //     if (!user.id || !user.user_metadata?.clientId) {
    //       console.warn(`⚠️ User ${user.id} has no ID, skipping deletion.`);
    //       return null;
    //     }
    //
    //     if (isAdmin) {
    //       if (user.role !== 'admin') {
    //         console.warn(
    //           `⚠️ Skipping user ${user.id} deletion. Role: ${user.role}`,
    //         );
    //         return null;
    //       }
    //     }
    //
    //     await this.clientRepository.updateIdSupabaseAuth(
    //       user.user_metadata?.clientId || '1',
    //       null,
    //     );
    //
    //     const { data, error } = await this.repository.deleteUser(user.id);
    //     if (error) {
    //       console.warn(`❌ Failed to delete user ${user.id}:`, error.message);
    //       return null;
    //     }
    //     console.log(`✅ User ${user.id} deleted successfully.`);
    //     return data;
    //   } catch (err) {
    //     console.error(`❌ Unexpected error deleting user ${user.id}:`, err);
    //     return null;
    //   }
    // });
  }

  /**
   * @deprecated do not use this method
   */
  async syncClientsWithAuthUsers(isAdmin: boolean): Promise<void> {
    const allClients = await this.clientRepository.findAll(
      '7fa9293c-3700-11ee-ba6d-9d20c6833ca2',
      isAdmin,
    );

    if (!allClients.length) {
      throw new Error('No clients found to create users');
    }

    const allAuthUsers = await this.findAllUsers();

    const userTasks = allClients.map(async (client) => {
      try {
        let existingUser: User | null = null;

        // 🔍 1. Busca direta por ID
        if (client.supabaseAuthId) {
          try {
            const { user } = await this.findUserById(client.supabaseAuthId);
            existingUser = user;
          } catch (err) {
            console.warn(
              `⚠️ Usuário com ID ${client.supabaseAuthId} não encontrado. Fallback para busca por clientId.`,
            );
          }
        }

        // 🔍 2. Busca por clientId se não encontrou por ID
        if (!existingUser) {
          existingUser = allAuthUsers.find(
            (user) => user.user_metadata?.clientId === client.id,
          );
        }

        // ✅ Atualização ou recriação
        if (existingUser) {
          const currentEmail = existingUser.email?.toLowerCase();
          const expectedEmail = client.email.toLowerCase();

          if (currentEmail !== expectedEmail) {
            console.log(
              `✏️ Email mismatch for client ${client.id}. Recreating user...`,
            );

            await this.repository.deleteUser(existingUser.id);

            const { data, error } = await this.repository.createUser({
              email: client.email,
              password: '123',
              emailConfirmed: true,
              role: isAdmin ? 'admin' : 'user',
              appMetadata: { enabled: client.isActive },
              userMetadata: {
                clientId: client.id,
                clientIdAuth: client.idAuth || null,
                idCompany: client.idCompany || null,
                clientName: client.name || null,
              },
            });

            if (error) {
              console.warn(
                `❌ Failed to recreate user for client ${client.id}:`,
                error.message,
              );
              return null;
            }

            await this.clientRepository.updateIdSupabaseAuth(
              client.id,
              data.user.id,
            );
          } else {
            await this.repository.toggleUserAccess(
              existingUser.id,
              client.isActive,
            );

            if (!client.supabaseAuthId) {
              await this.clientRepository.updateIdSupabaseAuth(
                client.id,
                existingUser.id,
              );
            }
          }
        } else {
          // 👤 Criar novo usuário
          const { data, error } = await this.repository.createUser({
            email: client.email,
            password: '123',
            emailConfirmed: true,
            role: isAdmin ? 'admin' : 'user',
            appMetadata: { enabled: client.isActive },
            userMetadata: {
              clientId: client.id,
              clientIdAuth: client.idAuth || null,
              idCompany: client.idCompany || null,
              clientName: client.name || null,
            },
          });

          if (error) {
            console.warn(
              `❌ Failed to create user for client ${client.id}:`,
              error.message,
            );
            return null;
          }

          await this.clientRepository.updateIdSupabaseAuth(
            client.id,
            data.user.id,
          );
        }

        return true;
      } catch (err) {
        console.error(
          `❌ Erro inesperado ao processar o client ${client.id}:`,
          err,
        );
        return null;
      }
    });

    const results = await Promise.all(userTasks);
    const successCount = results.filter(Boolean).length;

    console.log(`✅ ${successCount} usuários processados com sucesso.`);
  }
}
