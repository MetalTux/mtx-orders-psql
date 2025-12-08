import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

// *******************************************************************
// NOTA IMPORTANTE: Esta es una función de HASH simulada SÓLO para el seed.
// En producción, debes usar una librería de hashing asíncrona (como bcrypt).
// *******************************************************************
const HASH_PASSWORD_FUNCTION = (password: string) => `hashed_pw_for_${password}`;

const prisma = new PrismaClient();

/**
 * Inserta una compañía y un usuario de prueba en la base de datos,
 * asegurando que la compañía esté asociada a la comuna "Curicó".
 */
async function seedTestCompanyAndUser() {
    console.log('---');
    console.log('Iniciando Seeding de Compañía y Usuario de Prueba...');

    try {
        // 1. Limpieza de datos existentes de Compañía y Usuario
        console.log('Borrando datos existentes de usuarios y compañías...');
        // Limpieza en orden inverso (Usuario depende de Compañía)
        await prisma.users.deleteMany({});
        await prisma.companies.deleteMany({});
        console.log('Limpieza de datos de prueba completada.');
        
        // 2. Obtener el ID de la Comuna "Curicó"
        console.log('Buscando ID para la comuna "Curicó"...');
        const curicoCommune = await prisma.communes.findFirst({
            where: {
                commune_name: 'Curicó'
            },
            select: {
                commune_id: true,
                commune_name: true,
            },
        });

        if (!curicoCommune) {
            console.error('ERROR: No se encontró la comuna "Curicó". Por favor, asegúrate de haber ejecutado el seeder geográfico (seed_chile_geo.ts) previamente.');
            return;
        }

        const communeId = curicoCommune.commune_id;
        const communeName = curicoCommune.commune_name;
        console.log(`- Comuna encontrada: ${communeName} (ID: ${communeId})`);


        // 3. Insertar Compañía de Prueba (vinculada a Curicó)
        const companyId = uuidv4();
        const testCompany = await prisma.companies.create({
            data: {
                company_id: companyId,
                company_name: 'MTX - Test Logistics',
                company_rut: '76.284.990-2', 
                address_line1: `Oficina Central en ${communeName}`,
                phone_number: '+56 9 1234 5678',
                email: 'contacto@mtxtest.cl',
                commune_id: communeId, // <-- Enlace a Curicó
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        console.log(`- Compañía de Prueba insertada: ${testCompany.company_name}`);

        // 4. Insertar Usuario Administrador de Prueba
        const password = '123456';
        const passwordHash = HASH_PASSWORD_FUNCTION(password); // Usar el hash simulado

        const userId = uuidv4();
        const testUser = await prisma.users.create({
            data: {
                user_id: userId,
                company_id: companyId, // Enlace a la compañía de prueba
                user_name: 'Admin JR',
                user_email: 'jrios.03@hotmail.com', // Correo de prueba
                user_password: passwordHash, 
                is_active: true,
                role: '',
                created_at: new Date(),
                updated_at: new Date(),
            },
        });
        console.log(`- Usuario Administrador insertado: ${testUser.user_email}`);
        console.log('---');
        console.log('¡Seeding de datos de prueba completado!');
        console.log('Credenciales de Acceso para Pruebas (DEV/Local):');
        console.log(`  Email: admin@mtxtest.cl`);
        console.log(`  Contraseña: ${password}`);
        console.log('---');

    } catch (error) {
        console.error('Fallo el proceso de seeding de Compañía y Usuario:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la función principal
seedTestCompanyAndUser();