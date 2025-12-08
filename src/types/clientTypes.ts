// src/types/clientTypes.ts
// Interfaces basadas en el modelo 'clients' de Prisma

export interface Client {
  client_id: string;
  company_id: string;
  client_name: string;
  client_rut: string | null;
  client_type: string | null;
  billing_email: string | null;
  billing_phone_number: string | null;
  address_line1: string | null;
  address_line2: string | null;
  commune_id: string | null;
  postal_code: string | null;
  notes: string | null;
  is_active: boolean;
  created_at: Date | string;
  updated_at: Date | string;
  // Propiedades adicionales (relaciones) que podrías querer mostrar:
  commune_name?: string; 
}

export interface ClientFormData {
  client_id: string;
  client_name: string;
  client_rut: string;
  client_type: string;
  billing_email: string;
  billing_phone_number: string;
  address_line1: string;
  address_line2: string;
  commune_id: string;
  postal_code: string;
  notes: string;
}