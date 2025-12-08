// src/lib/LocationAPI.ts

import { Country, Region, Province, Commune } from '@/types/locationTypes';

const BASE_URL = '/api/location';

// Definimos el tipo de respuesta para la nueva función de edición
export type LocationPath = {
    countryId: string;
    regionId: string;
    provinceId: string;
};

export const LocationAPI = {
  /** Obtiene todos los países disponibles. */
  async getCountries(): Promise<Country[]> {
    const response = await fetch(`${BASE_URL}?entity=countries`);
    if (!response.ok) {
      throw new Error(`Error fetching countries: ${response.statusText}`);
    }
    return response.json();
  },

  /** Obtiene regiones filtradas por country_id. */
  async getRegions(countryId: string): Promise<Region[]> {
    const response = await fetch(`${BASE_URL}?entity=regions&countryId=${countryId}`);
    if (!response.ok) {
      throw new Error(`Error fetching regions: ${response.statusText}`);
    }
    return response.json();
  },

  /** Obtiene provincias filtradas por region_id. */
  async getProvinces(regionId: string): Promise<Province[]> {
    const response = await fetch(`${BASE_URL}?entity=provinces&regionId=${regionId}`);
    if (!response.ok) {
      throw new Error(`Error fetching provinces: ${response.statusText}`);
    }
    return response.json();
  },

  /** Obtiene comunas filtradas por province_id. */
  async getCommunes(provinceId: string): Promise<Commune[]> {
    const response = await fetch(`${BASE_URL}?entity=communes&provinceId=${provinceId}`);
    if (!response.ok) {
      throw new Error(`Error fetching communes: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Obtiene la ruta completa (País, Región, Provincia) a partir de un communeId.
   * Necesario para pre-seleccionar los selectores en modo edición.
   */
  async getPathForCommune(communeId: string): Promise<LocationPath> {
    const response = await fetch(`${BASE_URL}?entity=path&communeId=${communeId}`);
    if (!response.ok) {
        throw new Error(`Error fetching location path for commune ${communeId}: ${response.statusText}`);
    }
    // NOTA: Si el API devuelve null/error, el frontend lo manejará como error de carga.
    const result = await response.json();
    if (!result.countryId || !result.regionId || !result.provinceId) {
        throw new Error("Ruta de ubicación incompleta recibida del servidor.");
    }
    return result;
  }
};