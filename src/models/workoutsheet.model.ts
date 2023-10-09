export class WorkoutsheetModel {
  id: string;
  isActive: boolean;
  lastUpdate: Date;
  idCompany: string;
  name: string;
  idClient: string;
  idWorkoutsheetDefault: string;
  workoutsheetOrder: number;

  constructor(data: {
    id?: string;
    isActive?: boolean;
    lastUpdate?: Date;
    name?: string;
    idClient?: string;
    idWorkoutsheetDefault?: string;
    idCompany?: string;
    workoutsheetOrder?: number;
  }) {
    this.id = data.id || '';
    this.isActive = data.isActive || false;
    this.lastUpdate = data.lastUpdate || new Date();
    this.name = data.name || '';
    this.idClient = data.idClient || '';
    this.idWorkoutsheetDefault = data.idWorkoutsheetDefault || '';
    this.idCompany = data.idCompany || '';
    this.workoutsheetOrder = data.workoutsheetOrder || 0;
  }
}
