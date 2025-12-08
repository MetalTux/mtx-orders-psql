// src/app/(main)/dashboard/clients/ClientForm.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Client, ClientFormData } from '@/types/clientTypes';
import { X, Save } from 'lucide-react';
import { LocationAPI } from '@/lib/LocationAPI';
import { Country, Region, Province, Commune } from '@/types/locationTypes';

interface ClientFormProps {
  clientToEdit: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ClientFormData, clientId?: string) => void;
  isLoading: boolean;
}

const initialFormData: ClientFormData = {
  client_id: '',
  client_name: '',
  client_rut: '',
  client_type: 'Empresa',
  billing_email: '',
  billing_phone_number: '',
  address_line1: '',
  address_line2: '',
  commune_id: '',
  postal_code: '',
  notes: '',
};

/**
 * Función helper para inicializar el estado del formulario basado en clientToEdit.
 */
const getInitialFormData = (client: Client | null): ClientFormData => {
    if (client) {
        // Modo Edición: Cargar datos existentes
        return {
            client_id: client.client_id || '',
            client_name: client.client_name || '',
            client_rut: client.client_rut || '',
            client_type: client.client_type || 'Empresa',
            billing_email: client.billing_email || '',
            billing_phone_number: client.billing_phone_number || '',
            address_line1: client.address_line1 || '',
            address_line2: client.address_line2 || '',
            commune_id: client.commune_id || '', 
            postal_code: client.postal_code || '',
            notes: client.notes || '',
        };
    }
    // Modo Creación: Usar datos iniciales
    return initialFormData;
};

/**
 * Componente de Formulario para Crear o Editar un Cliente.
 */
export default function ClientForm({ clientToEdit, isOpen, onClose, onSave, isLoading }: ClientFormProps) {
  
  const [formData, setFormData] = useState<ClientFormData>(() => getInitialFormData(clientToEdit));
  const [isEditing, setIsEditing] = useState<boolean>(!!clientToEdit);

  // --- Estado para la Cascada de Ubicación ---
  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [communesList, setCommunesList] = useState<Commune[]>([]);

  // IDs seleccionados temporalmente para la cascada (solo se actualizan en la UI)
  const [selectedCountryId, setSelectedCountryId] = useState<string>('');
  const [selectedRegionId, setSelectedRegionId] = useState<string>('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');

  // Único estado de carga para la inicialización completa de la ubicación
  const [locationLoading, setLocationLoading] = useState(false); 
  const [locationError, setLocationError] = useState<string | null>(null);
  
  // --- Funciones de Fetch para Interacción del Usuario (NO CASCADA INICIAL) ---

  const fetchRegions = async (countryId: string) => {
    setLocationError(null);
    try {
        const data = await LocationAPI.getRegions(countryId);
        setRegions(data);
        return data;
    } catch (err) {
        setLocationError('Fallo al cargar regiones.');
        console.error(err);
        return [];
    }
  };

  const fetchProvinces = async (regionId: string) => {
    setLocationError(null);
    try {
        const data = await LocationAPI.getProvinces(regionId);
        setProvinces(data);
        return data;
    } catch (err) {
        setLocationError('Fallo al cargar provincias.');
        console.error(err);
        return [];
    }
  };

  const fetchCommunes = async (provinceId: string) => {
    setLocationError(null);
    try {
        const data = await LocationAPI.getCommunes(provinceId);
        setCommunesList(data);
        return data;
    } catch (err) {
        setLocationError('Fallo al cargar comunas.');
        console.error(err);
        return [];
    }
  };


  // --- Lógica de Inicialización (Una Sola Vez al Abrir el Modal) ---

  /**
   * Este efecto se ejecuta cuando el modal se abre o cuando cambia el cliente a editar.
   * Centraliza la carga inicial de PAÍS, REGIÓN, PROVINCIA y COMUNA para evitar el parpadeo.
   */
  useEffect(() => {
    if (!isOpen) {
        setLocationError(null);
        return;
    }

    // Resetear estados al abrir el modal para un nuevo cliente o al cambiar el cliente
    setFormData(() => getInitialFormData(clientToEdit));
    setIsEditing(!!clientToEdit);
    setSelectedCountryId('');
    setSelectedRegionId('');
    setSelectedProvinceId('');
    setRegions([]);
    setProvinces([]);
    setCommunesList([]);


    const initializeLocation = async () => {
      // 1. INICIO DE CARGA GLOBAL
      setLocationLoading(true);
      setLocationError(null);
      
      try {
        // A. Cargar Países (siempre el primer paso)
        const countryData = await LocationAPI.getCountries();
        setCountries(countryData);

        // B. Lógica específica para modo edición (Carga de Path completa)
        if (clientToEdit?.commune_id) {
            
            // 1. Obtener la ruta completa (País, Región, Provincia)
            const path = await LocationAPI.getPathForCommune(clientToEdit.commune_id); 
            
            // 2. Cargar datos intermedios basados en la ruta (secuencial y síncrono)
            // Usamos las funciones de fetch que actualizan el estado de la lista (regions, provinces, communesList)
            await fetchRegions(path.countryId);
            await fetchProvinces(path.regionId);
            await fetchCommunes(path.provinceId);
            
            // 3. Pre-seleccionar los IDs de los selectores UI para que se muestren los valores correctos
            setSelectedCountryId(path.countryId);
            setSelectedRegionId(path.regionId);
            setSelectedProvinceId(path.provinceId);
        }

      } catch (error) {
          setLocationError('Fallo en la carga inicial de ubicación. Revisar logs.');
          console.error("Error en initializeLocation:", error);
      } finally {
        // 2. FIN DE CARGA GLOBAL
        setLocationLoading(false); 
      }
    };

    initializeLocation();

  }, [isOpen, clientToEdit]); // Dependencias: clientToEdit para recargar al cambiar el cliente.
  
  // --- Manejadores para la Cascada (Interacción del Usuario) ---

  const handleCountryChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedCountryId(value);
    setSelectedRegionId('');
    setSelectedProvinceId('');
    setFormData(prev => ({ ...prev, commune_id: '' }));
    setProvinces([]);
    setCommunesList([]);

    if (value) {
        setLocationLoading(true);
        await fetchRegions(value);
        setLocationLoading(false);
    } else {
        setRegions([]);
    }
  };

  const handleRegionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRegionId(value);
    setSelectedProvinceId('');
    setFormData(prev => ({ ...prev, commune_id: '' }));
    setCommunesList([]);

    if (value) {
        setLocationLoading(true);
        await fetchProvinces(value);
        setLocationLoading(false);
    } else {
        setProvinces([]);
    }
  };

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedProvinceId(value);
    setFormData(prev => ({ ...prev, commune_id: '' }));

    if (value) {
        setLocationLoading(true);
        await fetchCommunes(value);
        setLocationLoading(false);
    } else {
        setCommunesList([]);
    }
  };

  const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, commune_id: value }));
  };

  // Resto de la lógica del formulario
  if (!isOpen) return null;

  // Manejador genérico para inputs de texto/número/email/textarea
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, isEditing ? clientToEdit?.client_id : undefined);
  };

  // Mostrar un loader de pantalla completa si la ubicación se está cargando inicialmente
  const isGlobalLoading = isLoading || locationLoading;

  return (
    // Modal Overlay
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      
      {/* Modal Content */}
      <div className="bg-(--color-bg-secondary) rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all">
        
        {/* Header del Modal */}
        <div className="sticky top-0 p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-(--color-bg-secondary) z-10">
          <h2 className="text-xl font-bold text-(--color-text-secondary)">
            {isEditing ? 'Editar Cliente: ' + clientToEdit?.client_name : 'Crear Nuevo Cliente'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
            <X className="w-6 h-6 text-(--color-text-secondary)" />
          </button>
        </div>

        {/* Indicador de carga centralizado para el formulario */}
        {isGlobalLoading && (
            <div className="p-10 flex flex-col items-center justify-center text-(--color-primary) space-y-3">
                <svg className="animate-spin h-8 w-8 text-(--color-primary)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className='text-lg'>Cargando datos {isEditing ? 'del cliente y su ubicación...' : 'iniciales...'}</p>
            </div>
        )}

        {/* Formulario (Oculto si está en carga inicial) */}
        <form onSubmit={handleSubmit} className={`p-6 space-y-6 ${isGlobalLoading ? 'hidden' : 'block'}`}>
          
          {/* Sección de Datos Generales */}
          <h3 className="text-lg font-semibold border-b pb-2 text-(--color-text-secondary)">Información General</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <Input
              label="Nombre del Cliente (Razón Social)"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              required
              disabled={isGlobalLoading}
            />
            <Input
              label="RUT o Identificación"
              name="client_rut"
              value={formData.client_rut}
              onChange={handleChange}
              disabled={isGlobalLoading}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Tipo de Cliente"
              name="client_type"
              value={formData.client_type}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({...prev, client_type: e.target.value}))} 
              options={['Empresa', 'Particular', 'Organización']}
              disabled={isGlobalLoading}
            />
            <Input
              label="Email de Facturación"
              name="billing_email"
              type="email"
              value={formData.billing_email}
              onChange={handleChange}
              disabled={isGlobalLoading}
            />
          </div>

          {/* Sección de Dirección y Cascada Geográfica */}
          <h3 className="text-lg font-semibold border-b pb-2 text-(--color-text-secondary)">Dirección Geográfica</h3>
          {locationError && (
              <div className="p-3 bg-(--color-danger)/10 text-(--color-danger) rounded-lg">
                Error de Ubicación: {locationError}
              </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 1. País */}
            <Select
              label="País"
              name="country_id"
              value={selectedCountryId}
              onChange={handleCountryChange}
              options={countries.map(c => ({ value: c.id, label: c.name }))}
              placeholder={'Selecciona País'}
              disabled={isGlobalLoading || countries.length === 0}
            />
            
            {/* 2. Región */}
            <Select
              label="Región"
              name="region_id"
              value={selectedRegionId}
              onChange={handleRegionChange}
              options={regions.map(r => ({ value: r.id, label: r.name }))}
              placeholder={selectedCountryId ? 'Selecciona Región' : 'Selecciona País primero'}
              disabled={isGlobalLoading || regions.length === 0 || !selectedCountryId}
            />

            {/* 3. Provincia */}
            <Select
              label="Provincia"
              name="province_id"
              value={selectedProvinceId}
              onChange={handleProvinceChange}
              options={provinces.map(p => ({ value: p.id, label: p.name }))}
              placeholder={selectedRegionId ? 'Selecciona Provincia' : 'Selecciona Región primero'}
              disabled={isGlobalLoading || provinces.length === 0 || !selectedRegionId}
            />

            {/* 4. Comuna */}
            <Select
              label="Comuna"
              name="commune_id"
              value={formData.commune_id}
              onChange={handleCommuneChange}
              options={communesList.map(c => ({ value: c.id, label: c.name }))}
              placeholder={selectedProvinceId ? 'Selecciona Comuna' : 'Selecciona Provincia primero'}
              disabled={isGlobalLoading || communesList.length === 0 || !selectedProvinceId}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Teléfono de Contacto"
              name="billing_phone_number"
              value={formData.billing_phone_number}
              onChange={handleChange}
              disabled={isGlobalLoading}
            />
            <Input
              label="Dirección (Línea 1 - Calle y Número)"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleChange}
              disabled={isGlobalLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Dirección (Línea 2 - Depto, Edificio, etc.)"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleChange}
              disabled={isGlobalLoading}
            />
             <Input
              label="Código Postal"
              name="postal_code"
              value={formData.postal_code}
              onChange={handleChange}
              disabled={isGlobalLoading}
            />
          </div>

          {/* Notas Adicionales */}
          <TextArea
            label="Notas Adicionales"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            disabled={isGlobalLoading}
          />
          
          {/* Pie del Formulario y Botones */}
          <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={isGlobalLoading}
              className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-(--color-text-main) hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isGlobalLoading || !formData.commune_id}
              className={`px-6 py-2 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 ${
                (isGlobalLoading || !formData.commune_id)
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-(--color-primary) hover:bg-(--color-primary-light)'
              }`}
            >
              <Save className="w-5 h-5" />
              {isGlobalLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Cliente')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Componentes Auxiliares (Sin cambios) ---

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const Input: React.FC<InputProps> = ({ label, name, value, onChange, disabled, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="text-sm font-medium block text-(--color-text-main)">
      {label}
    </label>
    <input
      id={name}
      name={name}
      value={value}
      onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} 
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200"
      {...props}
    />
  </div>
);

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: (string | { value: string; label: string })[]; 
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ label, name, value, onChange, disabled, options, placeholder, ...props }) => (
  <div className="space-y-1">
    <label htmlFor={name} className="text-sm font-medium block text-(--color-text-main)">
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200 appearance-none pr-8"
      {...props}
    >
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {options.map((option) => {
        const optionValue = typeof option === 'string' ? option : option.value;
        const optionLabel = typeof option === 'string' ? option : option.label;
        return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        );
      })}
    </select>
  </div>
);

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
}

const TextArea: React.FC<TextAreaProps> = ({ label, name, value, onChange, disabled, rows, ...props }) => (
    <div className="space-y-1">
        <label htmlFor={name} className="text-sm font-medium block text-(--color-text-main)">
            {label}
        </label>
        <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>} 
            disabled={disabled}
            rows={rows}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200"
            {...props}
        />
    </div>
);

// // src/app/(main)/dashboard/clients/ClientForm.tsx
// 'use client';

// import React, { useState, useEffect, useMemo } from 'react';
// import { Client, ClientFormData } from '@/types/clientTypes';
// import { X, Save } from 'lucide-react';

// // Importamos la nueva API de Ubicación y los tipos
// import { LocationAPI } from '@/lib/LocationAPI';
// import { Country, Region, Province, Commune } from '@/types/locationTypes';

// interface ClientFormProps {
//   clientToEdit: Client | null;
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: (data: ClientFormData, clientId?: string) => void;
//   isLoading: boolean;
//   // Eliminamos 'communes' de las props, la carga se hará internamente
//   // communes: { commune_id: string; name: string }[]; 
// }

// const initialFormData: ClientFormData = {
//   client_name: '',
//   client_rut: '',
//   client_type: 'Empresa',
//   billing_email: '',
//   billing_phone_number: '',
//   address_line1: '',
//   address_line2: '',
//   commune_id: '',
//   postal_code: '',
//   notes: '',
// };

// /**
//  * Función helper para inicializar el estado del formulario basado en clientToEdit.
//  */
// const getInitialFormData = (client: Client | null): ClientFormData => {
//   console.log("DATOS QUE LLEGAN DEL CLIENTE");
//   console.log(client);
//     if (client) {
//         // Modo Edición: Cargar datos existentes
//         return {
//             client_name: client.client_name || '',
//             client_rut: client.client_rut || '',
//             client_type: client.client_type || 'Empresa',
//             billing_email: client.billing_email || '',
//             billing_phone_number: client.billing_phone_number || '',
//             address_line1: client.address_line1 || '',
//             address_line2: client.address_line2 || '',
//             commune_id: client.commune_id || '', 
//             postal_code: client.postal_code || '',
//             notes: client.notes || '',
//         };
//     }
//     // Modo Creación: Usar datos iniciales
//     return initialFormData;
// };

// /**
//  * Componente de Formulario para Crear o Editar un Cliente.
//  */
// export default function ClientForm({ clientToEdit, isOpen, onClose, onSave, isLoading }: ClientFormProps) {
//   const [formData, setFormData] = useState<ClientFormData>(() => getInitialFormData(clientToEdit));
//   const [isEditing, setIsEditing] = useState<boolean>(!!clientToEdit);

//   // --- Estado para la Cascada de Ubicación ---
//   const [countries, setCountries] = useState<Country[]>([]);
//   const [regions, setRegions] = useState<Region[]>([]);
//   const [provinces, setProvinces] = useState<Province[]>([]);
//   const [communesList, setCommunesList] = useState<Commune[]>([]);

//   // IDs seleccionados temporalmente para la cascada (no se guardan en formData, excepto commune_id)
//   const [selectedCountryId, setSelectedCountryId] = useState<string>('');
//   const [selectedRegionId, setSelectedRegionId] = useState<string>('');
//   const [selectedProvinceId, setSelectedProvinceId] = useState<string>('');

//   const [locationLoading, setLocationLoading] = useState(false);
//   const [locationError, setLocationError] = useState<string | null>(null);

//   // Nuevo estado para asegurar que la cascada no corra hasta tener el path en edición
//   const [isLocationPathLoaded, setIsLocationPathLoaded] = useState(false); 

//   // --- Lógica de Inicialización y Pre-selección (Modo Edición) ---

//   // 1. Cargar Países y Pre-seleccionar Ruta Geográfica al abrir
//   useEffect(() => {
//     if (!isOpen) {
//         // Al cerrar el modal, limpiar cualquier error.
//         setLocationError(null);
//         return;
//     }

//     setFormData(() => getInitialFormData(clientToEdit));
//     setIsEditing(!!clientToEdit);

//     const fetchCountries = async () => {
//       setLocationLoading(true);
//       setLocationError(null);
//       try {
//         const data = await LocationAPI.getCountries();
//         setCountries(data);
//       } catch (err) {
//         setLocationError('Fallo al cargar países. ¿Están las tablas de ubicación en la BD?');
//         console.error(err);
//       }
//     };

//     const initializeLocationPathForEdit = async () => {
//         if (isEditing && clientToEdit?.commune_id) {
//             setLocationLoading(true);
//             try {
//                 // Obtener la ruta completa (Country, Region, Province) para el commune_id
//                 const path = await LocationAPI.getPathForCommune(clientToEdit.commune_id); 
                
//                 // 1. Pre-seleccionar los IDs de los padres
//                 setSelectedCountryId(path.countryId);
//                 setSelectedRegionId(path.regionId);
//                 setSelectedProvinceId(path.provinceId);
                
//                 // 2. Marcar como cargado para permitir que la cascada se ejecute
//                 setIsLocationPathLoaded(true); 

//             } catch (error) {
//                 setLocationError('Fallo al cargar la ruta de ubicación del cliente existente.');
//                 console.error(error);
//                 // Si falla, al menos dejamos que se carguen los países y se pueda seleccionar manualmente.
//                 setIsLocationPathLoaded(true); 
//             } finally {
//                 setLocationLoading(false);
//             }
//         } else {
//             // Modo Creación: Simplemente permitir la carga en cascada de inmediato.
//             setIsLocationPathLoaded(true);
//         }
//     }

//     // Ejecutar ambas lógicas
//     fetchCountries();
//     initializeLocationPathForEdit();

//     // Resetear estados si no estamos en edición
//     if (!isEditing) {
//         setSelectedCountryId('');
//         setSelectedRegionId('');
//         setSelectedProvinceId('');
//         setRegions([]);
//         setProvinces([]);
//         setCommunesList([]);
//         setIsLocationPathLoaded(false); // Se establece a true dentro de initializeLocationPathForEdit
//     }


//   }, [isOpen, isEditing, clientToEdit]); // Dependencias: clientToEdit para recargar al cambiar el cliente.

//   // 2. Cargar Regiones cuando cambia el País
//   useEffect(() => {
//     // Solo correr si la ruta ya está cargada (editado o creado)
//     if (!isLocationPathLoaded) return;
    
//     setRegions([]);
//     // Si cambia el país, reiniciamos la región/provincia/comuna, excepto si la estamos pre-cargando
//     if (selectedCountryId !== (clientToEdit?.commune_id && isEditing ? selectedCountryId : '')) { 
//         setSelectedRegionId('');
//         setSelectedProvinceId('');
//         setCommunesList([]);
//         setFormData(prev => ({ ...prev, commune_id: '' })); 
//     }

//     if (selectedCountryId) {
//       const fetchRegions = async () => {
//         setLocationLoading(true);
//         setLocationError(null);
//         try {
//           const data = await LocationAPI.getRegions(selectedCountryId);
//           setRegions(data);
//         } catch (err) {
//           setLocationError('Fallo al cargar regiones.');
//           console.error(err);
//         } finally {
//           setLocationLoading(false);
//         }
//       };
//       fetchRegions();
//     }
//   }, [selectedCountryId, isLocationPathLoaded]);

//   // 3. Cargar Provincias cuando cambia la Región
//   useEffect(() => {
//     if (!isLocationPathLoaded) return;

//     setProvinces([]);
//     if (selectedRegionId !== (clientToEdit?.commune_id && isEditing ? selectedRegionId : '')) {
//         setSelectedProvinceId('');
//         setCommunesList([]);
//         setFormData(prev => ({ ...prev, commune_id: '' })); 
//     }

//     if (selectedRegionId) {
//       const fetchProvinces = async () => {
//         setLocationLoading(true);
//         setLocationError(null);
//         try {
//           const data = await LocationAPI.getProvinces(selectedRegionId);
//           setProvinces(data);
//         } catch (err) {
//           setLocationError('Fallo al cargar provincias.');
//           console.error(err);
//         } finally {
//           setLocationLoading(false);
//         }
//       };
//       fetchProvinces();
//     }
//   }, [selectedRegionId, isLocationPathLoaded]);

//   // 4. Cargar Comunas cuando cambia la Provincia
//   useEffect(() => {
//     if (!isLocationPathLoaded) return;
    
//     setCommunesList([]);
    
//     // Solo limpiar commune_id si el cambio no es el de inicialización
//     if (selectedProvinceId !== (clientToEdit?.commune_id && isEditing ? selectedProvinceId : '')) {
//         setFormData(prev => ({ ...prev, commune_id: '' })); 
//     }

//     if (selectedProvinceId) {
//       const fetchCommunes = async () => {
//         setLocationLoading(true);
//         setLocationError(null);
//         try {
//           const data = await LocationAPI.getCommunes(selectedProvinceId);
//           setCommunesList(data);
//         } catch (err) {
//           setLocationError('Fallo al cargar comunas.');
//           console.error(err);
//         } finally {
//           setLocationLoading(false);
//         }
//       };
//       fetchCommunes();
//     }
//   }, [selectedProvinceId, isLocationPathLoaded]);
  
//   // Manejadores para la cascada
//   const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedCountryId(value);
//     setSelectedRegionId('');
//     setSelectedProvinceId('');
//     setFormData(prev => ({ ...prev, commune_id: '' }));
//   };

//   const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedRegionId(value);
//     setSelectedProvinceId('');
//     setFormData(prev => ({ ...prev, commune_id: '' }));
//   };

//   const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     setSelectedProvinceId(value);
//     setFormData(prev => ({ ...prev, commune_id: '' }));
//   };

//   const handleCommuneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const { value } = e.target;
//     setFormData((prev) => ({ ...prev, commune_id: value }));
//   };

//   // Resto de la lógica del formulario
//   if (!isOpen) return null;

//   // Manejador genérico para inputs de texto/número/email/textarea
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSave(formData, isEditing ? clientToEdit?.client_id : undefined);
//   };

//   return (
//     // Modal Overlay
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      
//       {/* Modal Content */}
//       <div className="bg-(--color-bg-secondary) rounded-xl shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto transform transition-all">
        
//         {/* Header del Modal */}
//         <div className="sticky top-0 p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-(--color-bg-secondary) z-10">
//           <h2 className="text-xl font-bold text-(--color-text-secondary)">
//             {isEditing ? 'Editar Cliente: ' + clientToEdit?.client_name : 'Crear Nuevo Cliente'}
//           </h2>
//           <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
//             <X className="w-6 h-6 text-(--color-text-secondary)" />
//           </button>
//         </div>

//         {/* Formulario */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
//           {/* Sección de Datos Generales */}
//           <h3 className="text-lg font-semibold border-b pb-2 text-(--color-text-secondary)">Información General</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
//             <Input
//               label="Nombre del Cliente (Razón Social)"
//               name="client_name"
//               value={formData.client_name}
//               onChange={handleChange}
//               required
//               disabled={isLoading}
//             />
//             <Input
//               label="RUT o Identificación"
//               name="client_rut"
//               value={formData.client_rut}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Select
//               label="Tipo de Cliente"
//               name="client_type"
//               value={formData.client_type}
//               // Se mantiene el manejo de cambio simple para este Select
//               onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData(prev => ({...prev, client_type: e.target.value}))} 
//               options={['Empresa', 'Particular', 'Organización']}
//               disabled={isLoading}
//             />
//             <Input
//               label="Email de Facturación"
//               name="billing_email"
//               type="email"
//               value={formData.billing_email}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>

//           {/* Sección de Dirección y Cascada Geográfica */}
//           <h3 className="text-lg font-semibold border-b pb-2 text-(--color-text-secondary)">Dirección Geográfica</h3>
//           {locationError && (
//               <div className="p-3 bg-(--color-danger)/10 text-(--color-danger) rounded-lg">
//                 Error de Ubicación: {locationError}
//               </div>
//           )}

//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* 1. País */}
//             <Select
//               label="País"
//               name="country_id"
//               value={selectedCountryId}
//               onChange={handleCountryChange}
//               options={countries.map(c => ({ value: c.id, label: c.name }))}
//               placeholder={locationLoading ? 'Cargando...' : 'Selecciona País'}
//               disabled={isLoading || locationLoading || countries.length === 0}
//             />
            
//             {/* 2. Región */}
//             <Select
//               label="Región"
//               name="region_id"
//               value={selectedRegionId}
//               onChange={handleRegionChange}
//               options={regions.map(r => ({ value: r.id, label: r.name }))}
//               placeholder={locationLoading ? 'Cargando...' : (selectedCountryId ? 'Selecciona Región' : 'Selecciona País primero')}
//               disabled={isLoading || locationLoading || regions.length === 0 || !selectedCountryId}
//             />

//             {/* 3. Provincia */}
//             <Select
//               label="Provincia"
//               name="province_id"
//               value={selectedProvinceId}
//               onChange={handleProvinceChange}
//               options={provinces.map(p => ({ value: p.id, label: p.name }))}
//               placeholder={locationLoading ? 'Cargando...' : (selectedRegionId ? 'Selecciona Provincia' : 'Selecciona Región primero')}
//               disabled={isLoading || locationLoading || provinces.length === 0 || !selectedRegionId}
//             />

//             {/* 4. Comuna */}
//             <Select
//               label="Comuna"
//               name="commune_id"
//               value={formData.commune_id}
//               onChange={handleCommuneChange}
//               options={communesList.map(c => ({ value: c.id, label: c.name }))}
//               placeholder={locationLoading ? 'Cargando...' : (selectedProvinceId ? 'Selecciona Comuna' : 'Selecciona Provincia primero')}
//               disabled={isLoading || locationLoading || communesList.length === 0 || !selectedProvinceId}
//             />
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Teléfono de Contacto"
//               name="billing_phone_number"
//               value={formData.billing_phone_number}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//             <Input
//               label="Dirección (Línea 1 - Calle y Número)"
//               name="address_line1"
//               value={formData.address_line1}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>
          
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <Input
//               label="Dirección (Línea 2 - Depto, Edificio, etc.)"
//               name="address_line2"
//               value={formData.address_line2}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//              <Input
//               label="Código Postal"
//               name="postal_code"
//               value={formData.postal_code}
//               onChange={handleChange}
//               disabled={isLoading}
//             />
//           </div>

//           {/* Notas Adicionales */}
//           <TextArea
//             label="Notas Adicionales"
//             name="notes"
//             value={formData.notes}
//             onChange={handleChange}
//             rows={3}
//             disabled={isLoading}
//           />
          
//           {/* Pie del Formulario y Botones */}
//           <div className="flex justify-end pt-4 space-x-4 border-t border-gray-200 dark:border-gray-700">
//             <button
//               type="button"
//               onClick={onClose}
//               disabled={isLoading}
//               className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-(--color-text-main) hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             >
//               Cancelar
//             </button>
//             <button
//               type="submit"
//               disabled={isLoading || !formData.commune_id}
//               className={`px-6 py-2 rounded-lg text-white font-semibold flex items-center gap-2 transition-all duration-200 ${
//                 (isLoading || !formData.commune_id)
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-(--color-primary) hover:bg-(--color-primary-light)'
//               }`}
//             >
//               <Save className="w-5 h-5" />
//               {isLoading ? 'Guardando...' : (isEditing ? 'Guardar Cambios' : 'Crear Cliente')}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// // --- Componentes Auxiliares ---

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label: string;
// }

// const Input: React.FC<InputProps> = ({ label, name, value, onChange, disabled, ...props }) => (
//   <div className="space-y-1">
//     <label htmlFor={name} className="text-sm font-medium block text-(--color-text-main)">
//       {label}
//     </label>
//     <input
//       id={name}
//       name={name}
//       value={value}
//       onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} 
//       disabled={disabled}
//       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200"
//       {...props}
//     />
//   </div>
// );

// interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
//   label: string;
//   // Opciones ahora acepta un array de strings o de objetos con value/label
//   options: (string | { value: string; label: string })[]; 
//   placeholder?: string;
// }

// const Select: React.FC<SelectProps> = ({ label, name, value, onChange, disabled, options, placeholder, ...props }) => (
//   <div className="space-y-1">
//     <label htmlFor={name} className="text-sm font-medium block text-(--color-text-main)">
//       {label}
//     </label>
//     <select
//       id={name}
//       name={name}
//       value={value}
//       onChange={onChange}
//       disabled={disabled}
//       className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200 appearance-none pr-8"
//       {...props}
//     >
//       {placeholder && <option value="" disabled>{placeholder}</option>}
//       {options.map((option) => {
//         const optionValue = typeof option === 'string' ? option : option.value;
//         const optionLabel = typeof option === 'string' ? option : option.label;
//         return (
//           <option key={optionValue} value={optionValue}>
//             {optionLabel}
//           </option>
//         );
//       })}
//     </select>
//   </div>
// );

// interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
//     label: string;
// }

// const TextArea: React.FC<TextAreaProps> = ({ label, name, value, onChange, disabled, rows, ...props }) => (
//     <div className="space-y-1">
//         <label htmlFor={name} className="text-sm font-medium block text-(--color-text-main)">
//             {label}
//         </label>
//         <textarea
//             id={name}
//             name={name}
//             value={value}
//             onChange={onChange as React.ChangeEventHandler<HTMLTextAreaElement>} 
//             disabled={disabled}
//             rows={rows}
//             className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) bg-(--color-bg-main) text-(--color-text-main) transition-colors duration-200"
//             {...props}
//         />
//     </div>
// );