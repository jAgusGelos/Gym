export interface BodyMeasurement {
  id: string;
  userId: string;
  measurementDate: string;
  weight: number;
  height: number;
  bmi: number;
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  neck?: number;
  shoulders?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftBicep?: number;
  rightBicep?: number;
  leftForearm?: number;
  rightForearm?: number;
  leftThigh?: number;
  rightThigh?: number;
  leftCalf?: number;
  rightCalf?: number;
  frontPhoto?: string;
  sidePhoto?: string;
  backPhoto?: string;
  notes?: string;
  measuredBy?: string;
  createdAt: string;
}

export interface CreateBodyMeasurementDto {
  measurementDate: string;
  weight: number;
  height: number;
  bodyFatPercentage?: number;
  muscleMassPercentage?: number;
  neck?: number;
  shoulders?: number;
  chest?: number;
  waist?: number;
  hips?: number;
  leftBicep?: number;
  rightBicep?: number;
  leftForearm?: number;
  rightForearm?: number;
  leftThigh?: number;
  rightThigh?: number;
  leftCalf?: number;
  rightCalf?: number;
  frontPhoto?: string;
  sidePhoto?: string;
  backPhoto?: string;
  notes?: string;
}

export interface EvolutionStats {
  currentWeight: number | null;
  initialWeight: number | null;
  weightChange: number;
  currentBMI: number | null;
  initialBMI: number | null;
  bmiChange: number;
  currentBodyFat: number | null;
  initialBodyFat: number | null;
  bodyFatChange: number;
  totalMeasurements: number;
  firstMeasurementDate: string | null;
  lastMeasurementDate: string | null;
}

export interface MeasurementComparison {
  measurement1: BodyMeasurement;
  measurement2: BodyMeasurement;
  differences: {
    weight: number;
    bmi: number;
    bodyFatPercentage: number | null;
    muscleMassPercentage: number | null;
    neck: number | null;
    shoulders: number | null;
    chest: number | null;
    waist: number | null;
    hips: number | null;
    leftBicep: number | null;
    rightBicep: number | null;
    leftForearm: number | null;
    rightForearm: number | null;
    leftThigh: number | null;
    rightThigh: number | null;
    leftCalf: number | null;
    rightCalf: number | null;
  };
}

export interface PaginatedMeasurements {
  data: BodyMeasurement[];
  total: number;
  page: number;
  totalPages: number;
}
