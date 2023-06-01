import { Injectable } from '@nestjs/common';
import { CompanyService } from 'src/api/company/service/company.service';
import { ClientService } from 'src/api/client/service/client.service';
import { isToday } from 'src/api/utils/is-today';
import { WorkoutsheetService } from 'src/api/workoutsheet/service/workoutsheet.service';
import { AccessTokenModel } from 'src/models/access-token-user.model';
import { NotificationService } from 'src/api/notification/service/notification.service';

@Injectable()
export class AppHomeScreenService {
  constructor(
    private readonly workoutsheetService: WorkoutsheetService,
    private readonly companyService: CompanyService,
    private readonly clientService: ClientService,
    private readonly notificationService: NotificationService,
  ) {}

  async getHomeScreen(user: AccessTokenModel): Promise<any> {
    try {
      const clientDto = await this.clientService.findOne(user.clientId);
      const companyTipsInformation =
        await this.companyService.findAllCompanyMainInformation(
          user.clientIdCompany,
        );
      const companyPosturalPatterns =
        await this.companyService.findAllCompanyPosturalPattern(
          user.clientIdCompany,
        );
      const companyPartnerships =
        await this.companyService.findAllPartnershipByIdCompany(
          user.clientIdCompany,
        );
      const notifications = await this.notificationService.findAllByIdClient(
        user.clientId,
        user.clientIdCompany,
      );

      // Retrieve the user's training program and convert it to a readable format
      const myTrainingPlan =
        await this.workoutsheetService.getMyTrainingProgram(user);
      // const myTrainingPlan = this.convertRowsToWorkoutSheetResponseDto(rows);

      // Retrieve the user's current workout sheets and convert them to a readable format
      const allMyCurrentWorkoutSheets =
        await this.workoutsheetService.getAllMyCurrentWorkoutSheetsWithWorkouts(
          user,
        );

      // Check if the user has already completed today's workout
      const lastWorkout = myTrainingPlan[myTrainingPlan.length - 1];
      const todaysWorkoutHasBeenDone = isToday(lastWorkout.date);
      if (todaysWorkoutHasBeenDone) {
        return {
          myTrainingPlan: myTrainingPlan,
          myWorksheets: allMyCurrentWorkoutSheets,
          notifications: notifications,
          drawerMenu: {
            clientDto,
            companyTipsInformation,
            companyPosturalPatterns,
            companyPartnerships,
          },
        };
      }

      // Determine the order of the next workout sheet
      const orders = allMyCurrentWorkoutSheets.map(
        (workoutSheet) => workoutSheet.order,
      );
      const nextWorkoutSheetOrder = this.getNextWorkoutOrder(
        orders,
        lastWorkout.order,
      );

      // Add the next workout sheet to the user's training plan and return it
      myTrainingPlan.push(allMyCurrentWorkoutSheets[nextWorkoutSheetOrder - 1]);

      return {
        myTrainingPlan: myTrainingPlan,
        myWorksheets: allMyCurrentWorkoutSheets,
        notifications: notifications,
        drawerMenu: {
          clientDto,
          companyTipsInformation,
          companyPosturalPatterns,
          companyPartnerships,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  getNextWorkoutOrder(
    workoutSheets: number[],
    lastWorkoutDone: number,
  ): number {
    // Find the index of the last workout done in the workout sheets array
    const lastWorkoutIndex = workoutSheets.indexOf(lastWorkoutDone);

    // If the last workout is not found or is the last element in the array, return the first workout
    if (
      lastWorkoutIndex === -1 ||
      lastWorkoutIndex === workoutSheets.length - 1
    ) {
      return workoutSheets[0];
    }

    // Otherwise, return the next workout in the array
    return workoutSheets[lastWorkoutIndex + 1];
  }
}
