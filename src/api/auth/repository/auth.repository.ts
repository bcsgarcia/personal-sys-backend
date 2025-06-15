import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { AppAuthDto } from '../dto/request/app-auth.dto';
import { AuthDto } from '../dto/request/auth.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async findById(id: string): Promise<any> {
    try {
      // return this.databaseService.execute('SELECT * FROM auth WHERE id = ?', [id]);
      const { data, error } = await this.supabase
        .from('auth')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async emailAlreadyExists(email: string, idCompany: string): Promise<any> {
    try {
      // return this.databaseService.execute('SELECT * FROM auth WHERE email = ? and idCompany = ? ', [email, idCompany]);
      const { data, error } = await this.supabase
        .from('auth')
        .select('*')
        .eq('email', email)
        .eq('idCompany', idCompany);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findByEmailAndPass(authDto: AuthDto): Promise<any> {
    try {
      // return this.databaseService.execute('SELECT * FROM auth WHERE email = ? and pass = ? and isAdmin = ?', [
      //   authDto.email,
      //   authDto.pass,
      //   authDto.isAdmin,
      // ]);
      const { data, error } = await this.supabase
        .from('auth')
        .select('*')
        .eq('email', authDto.email)
        .eq('pass', authDto.pass)
        .eq('isAdmin', authDto.isAdmin);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async validateUser(email: string, pass: string): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   `SELECT *
      //    FROM auth
      //    WHERE email = '${email}'
      //      and pass = '${pass}'`,
      // );
      const { data, error } = await this.supabase
        .from('auth')
        .select('*')
        .eq('email', email)
        .eq('pass', pass);

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async appAuth(authDto: AppAuthDto): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   `SELECT c.id        as clientId,
      //           c.name      as clientName,
      //           a.email     as clientEmail,
      //           c.idCompany as clientIdCompany,
      //           c.idAuth    as clientIdAuth,
      //           c.photoUrl  as clientPhotoUrl
      //
      //    FROM auth a
      //             INNER JOIN client c on a.id = c.idAuth
      //
      //    WHERE a.email = '${authDto.email}'
      //      AND a.pass = '${authDto.password}'
      //      AND a.isAdmin = '0'`,
      //   [authDto.email, authDto.password],
      // );
      const { data, error } = await this.supabase
        .from('auth')
        .select(
          `email,
          id,
          client:client (
            id,
            name,
            idCompany,
            photoUrl
          )`,
        )
        .eq('email', authDto.email)
        .eq('pass', authDto.password)
        .eq('isAdmin', false)
        .single();

      if (error) throw error;

      // agora fazemos o “alias” em JS:
      const raw = data as any;
      return {
        clientEmail: raw.email,
        clientIdAuth: raw.id,
        clientId: raw.client?.[0]?.id ?? null,
        clientName: raw.client?.[0]?.name ?? null,
        clientIdCompany: raw.client?.[0]?.idCompany ?? null,
        clientPhotoUrl: raw.client?.[0]?.photoUrl ?? null,
      };
    } catch (error) {
      throw error;
    }
  }

  async adminAuthRefresh(authDto: AppAuthDto): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   `SELECT c.id        as clientId,
      //           c.name      as clientName,
      //           a.email     as clientEmail,
      //           c.idCompany as clientIdCompany,
      //           c.idAuth    as clientIdAuth,
      //           c.photoUrl  as clientPhotoUrl
      //    FROM auth a
      //             INNER JOIN client c on a.id = c.idAuth
      //    WHERE a.email = ?
      //      AND a.isAdmin = '1'`,
      //   [authDto.email],
      // );
      const { data, error } = await this.supabase
        .from('auth')
        .select(
          `
        email,
        id as clientIdAuth,
        client:client (
          id as clientId,
          name as clientName,
          idCompany as clientIdCompany,
          photoUrl as clientPhotoUrl
        )
      `,
        )
        .eq('email', authDto.email)
        .eq('isAdmin', true)
        .single();

      if (error) throw error;

      // força o TS a tratar `data` como any
      const raw = data as any;
      return {
        clientId: raw.client?.clientId,
        clientName: raw.client?.clientName,
        clientEmail: raw.email,
        clientIdCompany: raw.client?.clientIdCompany,
        clientIdAuth: raw.clientIdAuth,
        clientPhotoUrl: raw.client?.clientPhotoUrl,
      };
    } catch (error) {
      throw error;
    }
  }

  async adminAuth(authDto: AppAuthDto): Promise<any> {
    try {
      // return this.databaseService.execute(
      //   `SELECT c.id        as clientId,
      //           c.name      as clientName,
      //           a.email     as clientEmail,
      //           c.idCompany as clientIdCompany,
      //           c.idAuth    as clientIdAuth,
      //           c.photoUrl  as clientPhotoUrl
      //    FROM auth a
      //             INNER JOIN client c on a.id = c.idAuth
      //    WHERE a.email = ?
      //      AND a.pass = ?
      //      AND a.isAdmin = '1'`,
      //   [authDto.email, authDto.password],
      // );
      const { data, error } = await this.supabase
        .from('auth')
        .select(
          `
        id,
        email,
        client:client (
          id,
          name,
          idCompany,
          photoUrl
        )
      `,
        )
        .eq('email', authDto.email)
        .eq('pass', authDto.password)
        .eq('isAdmin', true)
        .single();

      if (error) throw error;

      // cast para any para acessar client sem erro de TS
      const auth = data as any;
      return {
        clientId: auth.client[0].id,
        clientName: auth.client[0].name,
        clientEmail: auth.email,
        clientIdCompany: auth.client[0].idCompany,
        clientIdAuth: auth.id,
        clientPhotoUrl: auth.client[0].photoUrl,
      };
    } catch (error) {
      throw error;
    }
  }

  async create(authDto: AuthDto): Promise<any> {
    try {
      // await this.databaseService.execute('INSERT INTO auth (email, pass, idCompany) VALUES (?, ?, ?)', [
      //   authDto.email,
      //   authDto.pass,
      //   authDto.idCompany,
      // ]);
      //
      // const [rows] = await this.databaseService.execute('SELECT * FROM auth WHERE email = ? and idCompany = ?', [
      //   authDto.email,
      //   authDto.idCompany,
      // ]);
      //
      // return rows;
      const { data, error } = await this.supabase
        .from('auth')
        .insert([
          {
            email: authDto.email,
            pass: authDto.pass,
            idCompany: authDto.idCompany,
          },
        ])
        .select('*')
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(authDto: AuthDto): Promise<void> {
    try {
      // await this.databaseService.execute('UPDATE auth SET email = ?, pass = ? WHERE id = ?', [
      //   authDto.email,
      //   authDto.pass,
      //   authDto.id,
      // ]);
      const { error } = await this.supabase
        .from('auth')
        .update({
          email: authDto.email,
          pass: authDto.pass,
        })
        .eq('id', authDto.id);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async updateEmailByIdClient(idClient: string, email: string): Promise<void> {
    try {
      // this.databaseService.execute('UPDATE auth SET email = ? WHERE id in (select idAuth from client where id = ?)', [
      //   email,
      //   idClient,
      // ]);
      // 1) buscar idAuth do client
      const { data: client, error: clientError } = await this.supabase
        .from('client')
        .select('idAuth')
        .eq('id', idClient)
        .single();
      if (clientError) throw clientError;

      // 2) atualizar email em auth
      const { error } = await this.supabase
        .from('auth')
        .update({ email })
        .eq('id', (client as any).idAuth);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async updatePassByIdClient(idClient: string, pass: string): Promise<void> {
    try {
      // this.databaseService.execute('UPDATE auth SET pass = ? WHERE id in (select idAuth from client where id = ?)', [
      //   pass,
      //   idClient,
      // ]);
      const { data: client, error: clientError } = await this.supabase
        .from('client')
        .select('idAuth')
        .eq('id', idClient)
        .single();
      if (clientError) throw clientError;

      const { error } = await this.supabase
        .from('auth')
        .update({ pass })
        .eq('id', (client as any).idAuth);
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteById(id: string): Promise<void> {
    // await this.databaseService.execute('update client set isActive=false WHERE id = ?', [id]);
    const { error } = await this.supabase
      .from('client')
      .update({ isActive: false })
      .eq('id', id);

    if (error) throw error;
  }

  async validateOldPass(idClient: string): Promise<string> {
    // const querie = 'SELECT pass FROM client c INNER JOIN auth a on a.id = c.idAuth WHERE c.id = ?';
    //
    // const rows = await this.databaseService.execute(querie, [idClient]);
    //
    // return rows[0];

    // buscar pass via join aninhado
    const { data, error } = await this.supabase
      .from('client')
      .select('auth ( pass )')
      .eq('id', idClient)
      .single();
    if (error) throw error;

    // cast para any para acessar auth.pass
    const raw = data as any;
    return raw.auth?.pass;
  }
}
