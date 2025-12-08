// src/app/api/location/route.ts
// Esta ruta maneja la lógica de fetching de datos geográficos (país, región, provincia, comuna)
// usando Prisma y la BD.

import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * Endpoint unificado para obtener datos geográficos en cascada.
 * Utiliza el parámetro 'entity' para determinar la tabla a consultar.
 * Asume las tablas: 'countries', 'regions', 'provinces', 'communes' en la BD.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const entity = searchParams.get('entity');
    
    // El 'switch' basado en 'entity' permite reutilizar un solo endpoint para toda la jerarquía.
    switch (entity) {
      
      case 'countries': {
        // CORRECCIÓN: Usar country_id y country_name, y mapear a id/name
        const countries = await prisma.countries.findMany({
          select: { country_id: true, country_name: true },
          orderBy: { country_name: 'asc' },
        });
        const transformedCountries = countries.map(c => ({
            id: c.country_id,
            name: c.country_name,
        }));
        return NextResponse.json(transformedCountries);
      }

      case 'regions': {
        const countryId = searchParams.get('countryId');
        if (!countryId) {
          return NextResponse.json({ error: 'countryId is required' }, { status: 400 });
        }
        // CORRECCIÓN: Usar region_id, region_name y filtrar por country_id
        const regions = await prisma.regions.findMany({
          where: { country_id: countryId },
          select: { region_id: true, region_name: true, country_id: true },
          orderBy: { region_name: 'asc' },
        });
        const transformedRegions = regions.map(r => ({
            id: r.region_id,
            name: r.region_name,
            country_id: r.country_id,
        }));
        return NextResponse.json(transformedRegions);
      }

      case 'provinces': {
        const regionId = searchParams.get('regionId');
        if (!regionId) {
          return NextResponse.json({ error: 'regionId is required' }, { status: 400 });
        }
        // CORRECCIÓN: Usar province_id, province_name y filtrar por region_id
        const provinces = await prisma.provinces.findMany({
          where: { region_id: regionId },
          select: { province_id: true, province_name: true, region_id: true },
          orderBy: { province_name: 'asc' },
        });
        const transformedProvinces = provinces.map(p => ({
            id: p.province_id,
            name: p.province_name,
            region_id: p.region_id,
        }));
        return NextResponse.json(transformedProvinces);
      }

      case 'communes': {
        const provinceId = searchParams.get('provinceId');
        if (!provinceId) {
          return NextResponse.json({ error: 'provinceId is required' }, { status: 400 });
        }
        // CORRECCIÓN: Usar commune_id, commune_name y filtrar por province_id
        const communes = await prisma.communes.findMany({
          where: { province_id: provinceId },
          select: { commune_id: true, commune_name: true, province_id: true },
          orderBy: { commune_name: 'asc' },
        });
        const transformedCommunes = communes.map(c => ({
            id: c.commune_id,
            name: c.commune_name,
            province_id: c.province_id,
        }));
        return NextResponse.json(transformedCommunes);
      }
      
      case 'path': {
        const communeId = searchParams.get('communeId');
        if (!communeId) {
            return NextResponse.json({ error: 'communeId is required' }, { status: 400 });
        }
        
        // CORRECCIÓN CLAVE: Obtener la ruta completa usando relaciones de Prisma
        const commune = await prisma.communes.findUnique({
            where: { commune_id: communeId },
            select: {
                provinces: {
                    select: {
                        province_id: true,
                        regions: {
                            select: {
                                region_id: true,
                                countries: {
                                    select: {
                                        country_id: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        
        if (!commune || !commune.provinces?.regions?.countries) {
            return NextResponse.json({ error: 'Location path not found for communeId' }, { status: 404 });
        }

        return NextResponse.json({
            countryId: commune.provinces.regions.countries.country_id,
            regionId: commune.provinces.regions.region_id,
            provinceId: commune.provinces.province_id,
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid entity specified' }, { status: 400 });
    }
  } catch (error) {
    console.error("Error fetching location data:", error);
    // Se muestra un error genérico, indicando que se debe revisar la BD
    return NextResponse.json(
        { error: 'Internal Server Error. Check database connection and table names (countries, regions, provinces, communes).' },
        { status: 500 }
    );
  }
}