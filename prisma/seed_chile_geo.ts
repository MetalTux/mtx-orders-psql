import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// Inicialización del cliente Prisma
const prisma = new PrismaClient();

// Estructura de datos completa para Chile
const chileGeoData = {
  country_name: 'Chile',
  country_code: 'CL',
  regions: [
    {
      region_name: 'Arica y Parinacota',
      region_ordinal: 'XV',
      provinces: [
        {
          province_name: 'Arica',
          communes: [
            'Arica',
            'Camarones',
          ],
        },
        {
          province_name: 'Parinacota',
          communes: [
            'General Lagos',
            'Putre',
          ],
        },
      ],
    },
    {
      region_name: 'Tarapacá',
      region_ordinal: 'I',
      provinces: [
        {
          province_name: 'Iquique',
          communes: [
            'Iquique',
            'Alto Hospicio',
          ],
        },
        {
          province_name: 'Tamarugal',
          communes: [
            'Camiña',
            'Colchane',
            'Huara',
            'Pica',
            'Pozo Almonte',
          ],
        },
      ],
    },
    {
      region_name: 'Antofagasta',
      region_ordinal: 'II',
      provinces: [
        {
          province_name: 'Antofagasta',
          communes: [
            'Antofagasta',
            'Mejillones',
            'Sierra Gorda',
            'Taltal',
          ],
        },
        {
          province_name: 'El Loa',
          communes: [
            'Calama',
            'Ollagüe',
            'San Pedro de Atacama',
          ],
        },
        {
          province_name: 'Tocopilla',
          communes: [
            'Tocopilla',
            'María Elena',
          ],
        },
      ],
    },
    {
      region_name: 'Atacama',
      region_ordinal: 'III',
      provinces: [
        {
          province_name: 'Copiapó',
          communes: [
            'Copiapó',
            'Caldera',
            'Tierra Amarilla',
          ],
        },
        {
          province_name: 'Chañaral',
          communes: [
            'Chañaral',
            'Diego de Almagro',
          ],
        },
        {
          province_name: 'Huasco',
          communes: [
            'Vallenar',
            'Alto del Carmen',
            'Freirina',
            'Huasco',
          ],
        },
      ],
    },
    {
      region_name: 'Coquimbo',
      region_ordinal: 'IV',
      provinces: [
        {
          province_name: 'Elqui',
          communes: [
            'La Serena',
            'Coquimbo',
            'Andacollo',
            'La Higuera',
            'Paiguano',
            'Vicuña',
          ],
        },
        {
          province_name: 'Limarí',
          communes: [
            'Ovalle',
            'Combarbalá',
            'Monte Patria',
            'Punitaqui',
            'Río Hurtado',
          ],
        },
        {
          province_name: 'Choapa',
          communes: [
            'Illapel',
            'Canela',
            'Los Vilos',
            'Salamanca',
          ],
        },
      ],
    },
    {
      region_name: 'Valparaíso',
      region_ordinal: 'V',
      provinces: [
        {
          province_name: 'Valparaíso',
          communes: [
            'Valparaíso',
            'Casablanca',
            'Concón',
            'Juan Fernández',
            'Puchuncaví',
            'Quintero',
            'Viña del Mar',
          ],
        },
        {
          province_name: 'Isla de Pascua',
          communes: [
            'Isla de Pascua',
          ],
        },
        {
          province_name: 'Los Andes',
          communes: [
            'Los Andes',
            'Calle Larga',
            'Rinconada',
            'San Esteban',
          ],
        },
        {
          province_name: 'Petorca',
          communes: [
            'La Ligua',
            'Cabildo',
            'Papudo',
            'Petorca',
            'Zapallar',
          ],
        },
        {
          province_name: 'Quillota',
          communes: [
            'Quillota',
            'Calera',
            'Hijuelas',
            'La Cruz',
            'Nogales',
          ],
        },
        {
          province_name: 'San Antonio',
          communes: [
            'San Antonio',
            'Algarrobo',
            'Cartagena',
            'El Quisco',
            'El Tabo',
            'Santo Domingo',
          ],
        },
        {
          province_name: 'San Felipe de Aconcagua',
          communes: [
            'San Felipe',
            'Catemu',
            'Llay-Llay',
            'Panquehue',
            'Putaendo',
            'Santa María',
          ],
        },
        {
          province_name: 'Marga Marga',
          communes: [
            'Quilpué',
            'Limache',
            'Olmué',
            'Villa Alemana',
          ],
        },
      ],
    },
    {
      region_name: 'Metropolitana de Santiago',
      region_ordinal: 'RM',
      provinces: [
        {
          province_name: 'Santiago',
          communes: [
            'Santiago',
            'Cerrillos',
            'Cerro Navia',
            'Conchalí',
            'El Bosque',
            'Estación Central',
            'Huechuraba',
            'Independencia',
            'La Cisterna',
            'La Florida',
            'La Granja',
            'La Pintana',
            'La Reina',
            'Las Condes',
            'Lo Barnechea',
            'Lo Espejo',
            'Lo Prado',
            'Macul',
            'Maipú',
            'Ñuñoa',
            'Pedro Aguirre Cerda',
            'Peñalolén',
            'Providencia',
            'Pudahuel',
            'Quilicura',
            'Quinta Normal',
            'Recoleta',
            'Renca',
            'San Joaquín',
            'San Miguel',
            'San Ramón',
            'Vitacura',
          ],
        },
        {
          province_name: 'Cordillera',
          communes: [
            'Puente Alto',
            'Pirque',
            'San José de Maipo',
          ],
        },
        {
          province_name: 'Chacabuco',
          communes: [
            'Colina',
            'Lampa',
            'Tiltil',
          ],
        },
        {
          province_name: 'Maipo',
          communes: [
            'San Bernardo',
            'Buin',
            'Calera de Tango',
            'Paine',
          ],
        },
        {
          province_name: 'Melipilla',
          communes: [
            'Melipilla',
            'Alhué',
            'Curacaví',
            'María Pinto',
            'San Pedro',
          ],
        },
        {
          province_name: 'Talagante',
          communes: [
            'Talagante',
            'El Monte',
            'Isla de Maipo',
            'Padre Hurtado',
            'Peñaflor',
          ],
        },
      ],
    },
    {
      region_name: 'Libertador General Bernardo O’Higgins',
      region_ordinal: 'VI',
      provinces: [
        {
          province_name: 'Cachapoal',
          communes: [
            'Rancagua',
            'Codegua',
            'Coinco',
            'Coltauco',
            'Doñihue',
            'Graneros',
            'Las Cabras',
            'Machalí',
            'Malloa',
            'Mostazal',
            'Olivar',
            'Peumo',
            'Pichidegua',
            'Quinta de Tilcoco',
            'Rengo',
            'Requínoa',
            'San Vicente de Tagua Tagua',
          ],
        },
        {
          province_name: 'Cardenal Caro',
          communes: [
            'Pichilemu',
            'La Estrella',
            'Litueche',
            'Marchihue',
            'Navidad',
            'Paredones',
          ],
        },
        {
          province_name: 'Colchagua',
          communes: [
            'San Fernando',
            'Chépica',
            'Chimbarongo',
            'Lolo',
            'Nancagua',
            'Palmilla',
            'Peralillo',
            'Placilla',
            'Pumanque',
            'Santa Cruz',
          ],
        },
      ],
    },
    {
      region_name: 'Maule',
      region_ordinal: 'VII',
      provinces: [
        {
          province_name: 'Talca',
          communes: [
            'Talca',
            'Curepto',
            'Encina',
            'Maule',
            'Pelarco',
            'Pencahue',
            'Río Claro',
            'San Clemente',
            'San Rafael',
          ],
        },
        {
          province_name: 'Linares',
          communes: [
            'Linares',
            'Colbún',
            'Longaví',
            'Parral',
            'Retiro',
            'San Javier',
            'Villa Alegre',
            'Yerbas Buenas',
          ],
        },
        {
          province_name: 'Curicó',
          communes: [
            'Curicó',
            'Hualañé',
            'Licantén',
            'Molina',
            'Rauco',
            'Romeral',
            'Sagrada Familia',
            'Teno',
            'Vichuquén',
          ],
        },
        {
          province_name: 'Cauquenes',
          communes: [
            'Cauquenes',
            'Chanco',
            'Pelluhue',
          ],
        },
      ],
    },
    {
      region_name: 'Ñuble',
      region_ordinal: 'XVI',
      provinces: [
        {
          province_name: 'Diguillín',
          communes: [
            'Chillán',
            'Chillán Viejo',
            'Bulnes',
            'Cobquecura',
            'Coelemu',
            'Coihueco',
            'El Carmen',
            'Ninhue',
            'Ñiquén',
            'Pemuco',
            'Pinto',
            'Portezuelo',
            'Quillón',
            'Quirihue',
            'Ránquil',
            'San Carlos',
            'San Fabián',
            'San Ignacio',
            'San Nicolás',
            'Treguaco',
            'Yungay',
          ],
        },
        {
          province_name: 'Itata',
          communes: [
            'Quirihue',
            'Cobquecura',
            'Coelemu',
            'Ninhue',
            'Portezuelo',
            'Ránquil',
            'Treguaco',
          ],
        },
        {
          province_name: 'Punilla',
          communes: [
            'San Carlos',
            'Coihueco',
            'Ñiquén',
            'San Fabián',
            'San Nicolás',
          ],
        },
      ],
    },
    {
      region_name: 'Biobío',
      region_ordinal: 'VIII',
      provinces: [
        {
          province_name: 'Concepción',
          communes: [
            'Concepción',
            'Coronel',
            'Chiguayante',
            'Florida',
            'Hualqui',
            'Lota',
            'Penco',
            'San Pedro de la Paz',
            'Santa Juana',
            'Talcahuano',
            'Tomé',
            'Hualpén',
          ],
        },
        {
          province_name: 'Arauco',
          communes: [
            'Lebu',
            'Arauco',
            'Cañete',
            'Contulmo',
            'Curanilahue',
            'Los Álamos',
            'Tirúa',
          ],
        },
        {
          province_name: 'Biobío',
          communes: [
            'Los Ángeles',
            'Antuco',
            'Cabrero',
            'Laja',
            'Mulchén',
            'Nacimiento',
            'Negrete',
            'Quilaco',
            'Quilleco',
            'San Rosendo',
            'Santa Bárbara',
            'Tucapel',
            'Yumbel',
          ],
        },
      ],
    },
    {
      region_name: 'La Araucanía',
      region_ordinal: 'IX',
      provinces: [
        {
          province_name: 'Cautín',
          communes: [
            'Temuco',
            'Carahue',
            'Cunco',
            'Curarrehue',
            'Freire',
            'Galvarino',
            'Gorbea',
            'Lautaro',
            'Loncoche',
            'Melipeuco',
            'Nueva Imperial',
            'Padre Las Casas',
            'Perquenco',
            'Pitrufquén',
            'Pucón',
            'Saavedra',
            'Teodoro Schmidt',
            'Toltén',
            'Vilcún',
            'Villarrica',
            'Cholchol',
          ],
        },
        {
          province_name: 'Malleco',
          communes: [
            'Angol',
            'Collipulli',
            'Curacautín',
            'Ercilla',
            'Lonquimay',
            'Los Sauces',
            'Lumaco',
            'Purén',
            'Renaico',
            'Traiguén',
            'Victoria',
          ],
        },
      ],
    },
    {
      region_name: 'Los Ríos',
      region_ordinal: 'XIV',
      provinces: [
        {
          province_name: 'Valdivia',
          communes: [
            'Valdivia',
            'Corral',
            'Lanco',
            'Los Lagos',
            'Máfil',
            'Mariquina',
            'Paillaco',
            'Panguipulli',
          ],
        },
        {
          province_name: 'Ranco',
          communes: [
            'La Unión',
            'Futrono',
            'Lago Ranco',
            'Río Bueno',
          ],
        },
      ],
    },
    {
      region_name: 'Los Lagos',
      region_ordinal: 'X',
      provinces: [
        {
          province_name: 'Llanquihue',
          communes: [
            'Puerto Montt',
            'Calbuco',
            'Cochamó',
            'Fresia',
            'Frutillar',
            'Los Muermos',
            'Maullín',
            'Puerto Varas',
          ],
        },
        {
          province_name: 'Chiloé',
          communes: [
            'Castro',
            'Ancud',
            'Chonchi',
            'Curaco de Vélez',
            'Dalcahue',
            'Puqueldón',
            'Queilén',
            'Quellón',
            'Quemchi',
            'Quinchao',
          ],
        },
        {
          province_name: 'Osorno',
          communes: [
            'Osorno',
            'Purranque',
            'Puyehue',
            'Río Negro',
            'San Juan de la Costa',
            'San Pablo',
          ],
        },
        {
          province_name: 'Palena',
          communes: [
            'Chaitén',
            'Futaleufú',
            'Hualaihué',
            'Palena',
          ],
        },
      ],
    },
    {
      region_name: 'Aysén del General Carlos Ibáñez del Campo',
      region_ordinal: 'XI',
      provinces: [
        {
          province_name: 'Coyhaique',
          communes: [
            'Coyhaique',
            'Lago Verde',
          ],
        },
        {
          province_name: 'Aysén',
          communes: [
            'Aisén',
            'Cisnes',
            'Guaitecas',
          ],
        },
        {
          province_name: 'General Carrera',
          communes: [
            'Chile Chico',
            'Río Ibáñez',
          ],
        },
        {
          province_name: 'Capitán Prat',
          communes: [
            'Cochrane',
            'O’Higgins',
            'Tortel',
          ],
        },
      ],
    },
    {
      region_name: 'Magallanes y de la Antártica Chilena',
      region_ordinal: 'XII',
      provinces: [
        {
          province_name: 'Magallanes',
          communes: [
            'Punta Arenas',
            'Laguna Blanca',
            'Río Verde',
            'San Gregorio',
          ],
        },
        {
          province_name: 'Tierra del Fuego',
          communes: [
            'Porvenir',
            'Primavera',
            'Timaukel',
          ],
        },
        {
          province_name: 'Última Esperanza',
          communes: [
            'Natales',
            'Torres del Paine',
          ],
        },
        {
          province_name: 'Antártica Chilena',
          communes: [
            'Antártica',
            'Cabo de Hornos',
          ],
        },
      ],
    },
  ],
};

/**
 * Función principal para sembrar (seed) la base de datos con datos geográficos de Chile.
 * Incluye una limpieza inicial.
 */
async function seedChileGeo() {
  console.log('Iniciando el seeding de la geografía chilena...');
  console.log('---');

  // 1. Limpieza de datos existentes (Eliminación en cascada inversa)
  try {
    console.log(`Borrando datos existentes de comunas, provincias, regiones y países...`);
    // Borrar de las tablas de menor a mayor dependencia
    await prisma.communes.deleteMany({});
    await prisma.provinces.deleteMany({});
    await prisma.regions.deleteMany({});
    await prisma.countries.deleteMany({});
    console.log('Limpieza completada con éxito.');
  } catch (error) {
    console.error('Error durante la fase de limpieza de datos:', error);
    return; // Detener el script si la limpieza falla
  }

  // 2. Inserción de datos
  try {
    console.log('Iniciando inserción de datos...');

    // A. Insertar País (Chile)
    const countryId = uuidv4();
    await prisma.countries.create({
      data: {
        country_id: countryId,
        country_name: chileGeoData.country_name,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
    console.log(`- País insertado: ${chileGeoData.country_name}`);


    // B. Insertar Regiones, Provincias y Comunas
    for (const regionData of chileGeoData.regions) {
      const regionId = uuidv4();

      // Inserción de la Región
      await prisma.regions.create({
        data: {
          region_id: regionId,
          region_name: regionData.region_name,
          region_roman_numeral: regionData.region_ordinal,
          country_id: countryId, // Enlace al país Chile
          created_at: new Date(),
          updated_at: new Date(),
        },
      });
      console.log(`  - Región insertada: ${regionData.region_name} (${regionData.region_ordinal})`);
      
      let provinceCount = 0;
      let communeCount = 0;

      for (const provinceData of regionData.provinces) {
        const provinceId = uuidv4();
        
        // Inserción de la Provincia
        await prisma.provinces.create({
          data: {
            province_id: provinceId,
            province_name: provinceData.province_name,
            region_id: regionId, // Enlace a la región
            created_at: new Date(),
            updated_at: new Date(),
          },
        });
        provinceCount++;

        // Inserción de las Comunas
        const communeInserts = provinceData.communes.map(communeName => ({
            commune_id: uuidv4(),
            commune_name: communeName,
            province_id: provinceId, // *** ÚNICO ID DE RELACIÓN PARA COMMUNE ***
            created_at: new Date(),
            updated_at: new Date(),
        }));

        await prisma.communes.createMany({
            data: communeInserts,
        });
        communeCount += communeInserts.length;
      }
      console.log(`    -> ${provinceCount} Provincias y ${communeCount} Comunas insertadas en ${regionData.region_name}.`);
    }

    console.log('---');
    console.log('¡Seeding de geografía chilena completado exitosamente!');
    
  } catch (error) {
    console.error('Error durante la inserción de datos geográficos:', error);
    // Vuelve a lanzar el error para que la ejecución se detenga y muestre el stack trace completo
    throw error; 
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
seedChileGeo();