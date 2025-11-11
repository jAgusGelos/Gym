export interface ProgressEntry {
  id: string;
  userId: string;
  fecha: Date;
  peso?: number;
  grasaCorporal?: number;
  masaMuscular?: number;
  pecho?: number;
  cintura?: number;
  caderas?: number;
  brazoIzquierdo?: number;
  brazoDerecho?: number;
  piernaIzquierda?: number;
  piernaDerecha?: number;
  fotos?: string[];
  notas?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProgressEntryDto {
  fecha: string;
  peso?: number;
  grasaCorporal?: number;
  masaMuscular?: number;
  pecho?: number;
  cintura?: number;
  caderas?: number;
  brazoIzquierdo?: number;
  brazoDerecho?: number;
  piernaIzquierda?: number;
  piernaDerecha?: number;
  fotos?: string[];
  notas?: string;
}

export interface ProgressStats {
  totalEntries: number;
  latestWeight: number | null;
  weightChange: number | null;
  latestBodyFat: number | null;
  bodyFatChange: number | null;
  firstEntry?: Date;
  latestEntry?: Date;
}
