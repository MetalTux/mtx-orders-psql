// src/types/clientTypes.ts

// --- Entidades Geográficas (Para relacionar Clientes/Sucursales) ---

export interface Commune {
    commune_id: string;
    province_id: string; // FK: Foreign key a Provinces
    commune_name: string;
    created_at: Date;
    updated_at: Date;
    // Relación
    provinces?: Province; 
}

export interface Province {
    province_id: string;
    region_id: string; // FK: Foreign key a Regions
    province_name: string;
    created_at: Date;
    updated_at: Date;
    // Relación
    regions?: Region; 
}

export interface Region {
    region_id: string;
    country_id: string; // FK: Foreign key a Countries
    region_name: string;
    region_ordinal: string; // Ej: 'RM' o 'V'
    created_at: Date;
    updated_at: Date;
}

// --- Entidades de Contacto ---

export interface ClientContact {
    contact_id: string;
    branch_id: string; // FK: Foreign key a ClientBranch
    contact_name: string;
    contact_phone: string | null;
    contact_email: string | null;
    created_at: Date;
    updated_at: Date;
}

// --- Entidad Sucursal ---

/**
 * Interface para la entidad Sucursal (el segundo nivel: Cliente -> Sucursal)
 * Corresponde a la tabla 'client_branches' en la base de datos.
 */
export interface ClientBranch {
    branch_id: string;
    client_id: string; // FK: Foreign key a Clients
    branch_name: string;
    address_line1: string;
    commune_id: string; // FK: Foreign key a Communes (o similar)
    // Otros datos de la sucursal
    created_at: Date;
    updated_at: Date;
}

// --- Entidad Cliente ---

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

// --- Entidades de Formulario (Para crear/editar) ---

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

export interface ClientBranchFormData {
    branch_name: string;
    address_line1: string;
    commune_id: string;
}

// // src/types/clientTypes.ts

// export interface ClientContact {
//     contact_id: string;
//     branch_id: string; // FK: Foreign key a ClientBranch
//     contact_name: string;
//     contact_phone: string | null;
//     contact_email: string | null;
//     created_at: Date;
//     updated_at: Date;
// }

// /**
//  * Interface para la entidad Sucursal (el segundo nivel: Cliente -> Sucursal)
//  * Corresponde a la tabla 'client_branches' en la base de datos.
//  */
// export interface ClientBranch {
//     branch_id: string;
//     client_id: string; // FK: Foreign key a Clients
//     branch_name: string;
//     address_line1: string;
//     commune_id: string; // FK: Foreign key a Communes (o similar)
//     // Otros datos de la sucursal
//     created_at: Date;
//     updated_at: Date;
    
//     // Propiedad de relación (usada en GET)
//     client_contacts?: ClientContact[];
// }


// export interface Client {
//   client_id: string;
//   company_id: string;
//   client_name: string;
//   client_rut: string | null;
//   client_type: string | null;
//   billing_email: string | null;
//   billing_phone_number: string | null;
//   address_line1: string | null;
//   address_line2: string | null;
//   commune_id: string | null;
//   postal_code: string | null;
//   notes: string | null;
//   is_active: boolean;
//   created_at: Date | string;
//   updated_at: Date | string;
//   // Propiedades adicionales (relaciones) que podrías querer mostrar:
//   commune_name?: string; 
// }

// export interface ClientFormData {
//   client_id: string;
//   client_name: string;
//   client_rut: string;
//   client_type: string;
//   billing_email: string;
//   billing_phone_number: string;
//   address_line1: string;
//   address_line2: string;
//   commune_id: string;
//   postal_code: string;
//   notes: string;
// }