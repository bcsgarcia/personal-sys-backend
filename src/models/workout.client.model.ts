export class WorkoutClientModel {
  id: string;
  idWorkout: string;
  idWorkoutSheet: string;
  title: string;
  subtitle: string;
  description: string;
  breakTime: string;
  series: string;
  workoutOrder: number;
  isActive: boolean;
  lastUpdate: Date;
  idCompany: string;
  mediaList: any;

  constructor(data: {
    id?: string;
    idWorkout?: string;
    title?: string;
    subtitle?: string;
    idWorkoutSheet?: string;
    breakTime?: string;
    series?: string;
    workoutOrder?: number;
    isActive?: boolean;
    lastUpdate?: Date;
    idCompany?: string;
    description?: string;
    mediaList?: any;
  }) {
    this.id = data.id || '';
    this.idWorkout = data.idWorkout || '';
    this.idWorkoutSheet = data.idWorkoutSheet || '';
    this.breakTime = data.breakTime || '';
    this.series = data.series || '';
    this.workoutOrder = data.workoutOrder || 0;
    this.isActive = data.isActive || false;
    this.lastUpdate = data.lastUpdate || new Date();
    this.idCompany = data.idCompany || '';
    this.title = data.title || '';
    this.subtitle = data.subtitle || '';
    this.description = data.description || '';
    this.mediaList = data.mediaList || [];
  }
}
