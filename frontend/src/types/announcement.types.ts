export interface Announcement {
  id: string;
  titulo: string;
  contenido: string;
  tipo: AnnouncementType;
  imagenUrl?: string;
  fechaPublicacion: Date;
  fechaExpiracion?: Date;
  activo: boolean;
  autorId: string;
  autor?: {
    id: string;
    nombre: string;
    apellido: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export enum AnnouncementType {
  NOVEDAD = 'NOVEDAD',
  EVENTO = 'EVENTO',
  PROMOCION = 'PROMOCION',
  MANTENIMIENTO = 'MANTENIMIENTO',
}

export interface CreateAnnouncementDto {
  titulo: string;
  contenido: string;
  tipo: AnnouncementType;
  imagenUrl?: string;
  fechaPublicacion: string;
  fechaExpiracion?: string;
}

export interface UpdateAnnouncementDto extends Partial<CreateAnnouncementDto> {
  activo?: boolean;
}
