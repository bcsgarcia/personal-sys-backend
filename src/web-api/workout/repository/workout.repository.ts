import { Injectable } from "@nestjs/common";
import { DatabaseService } from "src/database/database.service";
import { CreateWorkoutDto } from "../dto/create-workout.dto";
import { UpdateWorkoutDto } from "../dto/update-workout.dto";



@Injectable()
export class WorkoutRepository {
    constructor(private databaseService: DatabaseService) { }

    async create(workout: CreateWorkoutDto): Promise<void> {
        try {
            const createQuery =
                'insert into workout (title, subTitle, description, idCompany, videoUrl, imageUrl) values (?,?,?,?,?,?);'

            await this.databaseService.execute(createQuery, [
                workout.title,
                workout.subTitle,
                workout.description,
                workout.idCompany,
                workout.videoUrl,
                workout.imageUrl,
            ]);

        } catch (error) {
            throw error;
        }

    }


    async update(idWorkout: string, workout: UpdateWorkoutDto): Promise<void> {
        await this.databaseService.execute(
            'UPDATE workout SET title = ?, subTitle = ?, description = ?, videoUrl = ?, imageUrl = ? WHERE id = ?',
            [
                workout.title,
                workout.subTitle,
                workout.description,
                workout.videoUrl,
                workout.imageUrl,
                idWorkout,
            ],
        );
    }

    async findAll(idCompany: string): Promise<any> {
        return await this.databaseService.execute(`SELECT * FROM workout WHERE idCompany = '${idCompany}'`);
    }

    async deleteById(idWorkout: string): Promise<void> {
        await this.databaseService.execute(
            'UPDATE workout SET isActive = 0 WHERE id = ?',
            [idWorkout],
        );
    }
}