import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateGoalsDto } from '../dto/create-goals.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ClientProfileRepository {
  constructor(
    private databaseService: DatabaseService,
    @Inject('SUPABASE_CLIENT')
    private readonly supabase: SupabaseClient,
  ) {}

  async findGoalsByClientId(idClient: string, idCompany: string): Promise<any> {
    // return this.databaseService.execute(
    //   `SELECT cg.id, cg.description
    //    from clientGoal cg
    //    where cg.idClient = ?
    //      and cg.idCompany = ?
    //      and cg.isActive = 1
    //    order by cg.lastUpdate desc`,
    //   [idClient, idCompany],
    // );
    const { data, error } = await this.supabase
      .from('clientGoal')
      .select('id, description')
      .eq('idClient', idClient)
      .eq('idCompany', idCompany)
      .eq('isActive', true)
      .order('lastUpdate', { ascending: false });

    if (error) throw error;
    return data;
  }

  async findFeedbacksByClientId(idClient: string, idCompany: string): Promise<any> {
    // return this.databaseService.execute(
    //   `select wf.id, wf.feedback, wf.lastUpdate date, wc.title workoutTitle
    //    from workoutFeedback wf
    //        join workoutClient wc
    //    on wf.idWorkoutClient = wc.id and wc.isActive = 1
    //        join workoutSheet ws on wc.idWorkoutSheet = ws.id and ws.isActive = 1
    //    where ws.idClient = ?
    //      and wf.idCompany = ?
    //      and wf.isActive = 1
    //    order by wf.lastUpdate desc`,
    //   [idClient, idCompany],
    // );

    const { data, error } = await this.supabase
      .from('workoutFeedback')
      .select(
        `
        id,
        feedback,
        lastUpdate,
        workoutClient (
          id,
          title,
          workoutSheet (
            idClient
          )
        )
      `,
      )
      .eq('idCompany', idCompany)
      .eq('isActive', true)
      .order('lastUpdate', { ascending: false });

    if (error) throw error;

    return (data || [])
      .filter((fb: any) => fb.workoutClient?.[0]?.workoutSheet?.idClient === idClient)
      .map((fb: any) => ({
        id: fb.id,
        feedback: fb.feedback,
        date: fb.lastUpdate, // << alias aqui
        workoutTitle: fb.workoutClient[0].title,
      }));
  }

  async createClientGoals(clientGoalDto: CreateGoalsDto): Promise<void> {
    try {
      // // Construir a parte VALUES da query dinamicamente com base no número de goals
      // const valuesPlaceholder = clientGoalDto.goalList.map(() => '(?,?,?)').join(', ');
      // const createQuery = `INSERT INTO clientGoal (idClient, idCompany, description)
      //                      VALUES ${valuesPlaceholder};`;
      //
      // // Achatar a lista de parâmetros para corresponder aos placeholders
      // // Nota: Isso pressupõe que a propriedade "description" no DTO deve ser realmente "goalList"
      // const queryParams = clientGoalDto.goalList.reduce((acc, goal) => {
      //   return acc.concat([clientGoalDto.idClient, clientGoalDto.idCompany, goal]);
      // }, []);
      //
      // await this.databaseService.execute(createQuery, queryParams);

      const records = clientGoalDto.goalList.map((goal) => ({
        idClient: clientGoalDto.idClient,
        idCompany: clientGoalDto.idCompany,
        description: goal,
      }));

      const { error } = await this.supabase.from('clientGoal').insert(records);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }

  async deleteClientGoals(idsToDelete: string[]): Promise<void> {
    try {
      // const placeholders = new Array(idsToDelete.length).fill('?').join(', ');
      // const deleteQuery = `DELETE
      //                      FROM clientGoal
      //                      WHERE id IN (${placeholders});`;
      //
      // await this.databaseService.execute(deleteQuery, idsToDelete);
      const { error } = await this.supabase.from('clientGoal').delete().in('id', idsToDelete);

      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}
