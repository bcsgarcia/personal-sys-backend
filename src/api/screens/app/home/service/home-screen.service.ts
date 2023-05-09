import { Injectable } from '@nestjs/common';
import { CompanyService } from 'src/api/company/service/company.service';
import { ClientService } from 'src/api/client/service/client.service';
import { isToday } from 'src/api/utils/is-today';
import { WorkoutResponseDto } from 'src/api/workoutsheet/dto/response/workout-response.dto';
import { WorkoutSheetResponseDto } from 'src/api/workoutsheet/dto/response/workoutsheet-response.dto';
import { WorkoutsheetService } from 'src/api/workoutsheet/service/workoutsheet.service';
import { AccessTokenModel } from 'src/models/access-token-user.model';

@Injectable()
export class AppHomeScreenService {
    constructor(
        private readonly workoutsheetService: WorkoutsheetService,
        private readonly companyService: CompanyService,
        private readonly clientService: ClientService,
    ) { }

    async getHomeScreen(user: AccessTokenModel): Promise<any> {
        try {

            const clientDto = await this.clientService.findOne(user.clientId);
            const companyTipsInformation = await this.companyService.findAllCompanyMainInformation(user.clientIdCompany);
            const companyPosturalPatterns = await this.companyService.findAllCompanyPosturalPattern(user.clientIdCompany);
            const companyPartnerships = await this.companyService.findAllPartnershipByIdCompany(user.clientIdCompany);

            // Retrieve the user's training program and convert it to a readable format
            const rows = await this.workoutsheetService.getMyTrainingProgram(user);
            const myTrainingPlan = this.convertRowsToWorkoutSheetResponseDto(rows);

            // Retrieve the user's current workout sheets and convert them to a readable format
            const rowsCurrentWorkoutSheets = await this.workoutsheetService.getAllMyCurrentWorkoutSheetsWithWorkouts(user);
            const allMyCurrentWorkoutSheets = this.convertRowsToWorkoutSheetResponseDto(rowsCurrentWorkoutSheets);


            // Check if the user has already completed today's workout
            const lastWorkout = myTrainingPlan[myTrainingPlan.length - 1];
            const todaysWorkoutHasBeenDone = isToday(lastWorkout.date);
            if (todaysWorkoutHasBeenDone) {
                return {
                    "myTrainingPlan": myTrainingPlan,
                    "myWorksheets": allMyCurrentWorkoutSheets,
                    "drawerMenu": {
                        clientDto,
                        companyTipsInformation,
                        companyPosturalPatterns,
                        companyPartnerships
                    }
                };
            }

            // Determine the order of the next workout sheet
            const orders = allMyCurrentWorkoutSheets.map((workoutSheet) => workoutSheet.order);
            const nextWorkoutSheetOrder = this.getNextWorkoutOrder(orders, lastWorkout.order);

            // Add the next workout sheet to the user's training plan and return it
            myTrainingPlan.push(allMyCurrentWorkoutSheets[nextWorkoutSheetOrder - 1]);


            return {
                "myTrainingPlan": myTrainingPlan,
                "myWorksheets": allMyCurrentWorkoutSheets,
                "drawerMenu": {
                    clientDto,
                    companyTipsInformation,
                    companyPosturalPatterns,
                    companyPartnerships
                }
            };

        } catch (error) {
            throw error;
        }

    }

    getNextWorkoutOrder(workoutSheets: number[], lastWorkoutDone: number): number {
        // Find the index of the last workout done in the workout sheets array
        const lastWorkoutIndex = workoutSheets.indexOf(lastWorkoutDone);

        // If the last workout is not found or is the last element in the array, return the first workout
        if (lastWorkoutIndex === -1 || lastWorkoutIndex === workoutSheets.length - 1) {
            return workoutSheets[0];
        }

        // Otherwise, return the next workout in the array
        return workoutSheets[lastWorkoutIndex + 1];
    }

    convertRowsToWorkoutSheetResponseDto(rows: any[]): WorkoutSheetResponseDto[] {
        const groupedWorkouts = new Map<number, WorkoutSheetResponseDto>();

        for (const row of rows) {
            const workout: WorkoutResponseDto = {
                title: row.workoutTitle,
                subtitle: row.workoutSubtitle,
                description: row.workoutDescription,
                imageUrl: row.workoutImageUrl,
                videoUrl: row.workoutVideoUrl,
                order: row.workoutOrder,
                breaktime: row.workoutBreakTime,
                serie: row.workoutSeries,
            };

            const workoutSheetId = row.workoutSheetId;
            let workoutSheet = groupedWorkouts.get(workoutSheetId);

            if (!workoutSheet) {
                workoutSheet = {
                    id: workoutSheetId,
                    date: row.workoutSheedConclusionDate === undefined ? null : new Date(row.workoutSheedConclusionDate),
                    name: row.workoutSheetName,
                    order: row.workoutSheetOrder,
                    workouts: [],
                };
                groupedWorkouts.set(workoutSheetId, workoutSheet);
            }

            workoutSheet.workouts.push(workout);
        }

        return Array.from(groupedWorkouts.values());
    }
}