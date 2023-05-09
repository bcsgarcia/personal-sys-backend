import { Module } from "@nestjs/common";
import { AppHomeScreenController } from "./controllers/home-screen.controller";
import { AppHomeScreenService } from "./service/home-screen.service";
import { WorkoutsheetService } from "src/api/workoutsheet/service/workoutsheet.service";
import { WorkoutsheetRepository } from "src/api/workoutsheet/respository/workoutsheet.repository";
import { DatabaseService } from "src/database/database.service";
import { CompanyService } from "src/api/company/service/company.service";
import { CompanyRepository } from "src/api/company/respository/company.repository";
import { ClientService } from "src/api/client/service/client.service";
import { AuthService } from "src/api/auth/service/auth.service";
import { ClientRepository } from "src/api/client/repository/client.repository";
import { AuthRepository } from "src/api/auth/repository/auth.repository";
import { AuthModule } from "src/api/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    controllers: [AppHomeScreenController],
    providers: [
        AppHomeScreenService,
        WorkoutsheetService,
        DatabaseService,
        CompanyService,
        ClientService,
        AuthService,
        AuthRepository,
        ClientRepository,
        CompanyRepository,
        WorkoutsheetRepository
    ],
})
export class AppHomeScreenModule { }
