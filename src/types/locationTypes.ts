// src/types/locationTypes.ts

/**
 * Tipos de datos para la estructura geográfica (País, Región, Provincia, Comuna).
 * Se asume que las entidades tienen un 'id' (string) y un 'name' (string).
 */

export interface Country {
  id: string;
  name: string;
}

export interface Region {
  id: string;
  name: string;
  country_id: string; // ID del país padre
}

export interface Province {
  id: string;
  name: string;
  region_id: string; // ID de la región padre
}

export interface Commune {
  id: string;
  name: string;
  province_id: string; // ID de la provincia padre
}