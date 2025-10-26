import { Users, ClipboardList, DollarSign, Box } from 'lucide-react';
import Card from '@/components/Card';
// Importamos la función de obtención de datos y los tipos desde la nueva librería
import { getDashboardData } from '@/lib/dashboard-data'; 

// Las definiciones de tipos WorkOrderWithClient y DashboardQueryResult han sido movidas a src/lib/dashboard-data.ts

// Definición de las Tarjetas de Información
interface StatCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  colorClass: string;
}

// Componente para mostrar las estadísticas (Server Component)
const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass }) => (
  <Card className="flex items-center justify-between transition-all duration-300 transform hover:scale-[1.02] p-5">
    <div>
      <p className="text-sm font-medium text-[--color-text-secondary] uppercase">{title}</p>
      <p className="text-3xl font-bold mt-1 text-[--color-text-main]">{value.toLocaleString()}</p>
    </div>
    <div className={`p-3 rounded-full ${colorClass} text-white shadow-md`}>
      <Icon className="w-6 h-6" />
    </div>
  </Card>
);

// Helper para colores de estado
const getStatusClasses = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Componente principal de la página (Server Component)
export default async function DashboardPage() {
  
  // FIX: Llamada a la nueva función modular de obtención de datos
  // Ahora, la página solo llama a la función de la librería para obtener los datos.
  const [totalClients, totalQuotes, totalWorkOrders, recentWorkOrders] = await getDashboardData();
  
  const stats: StatCardProps[] = [
    {
      title: 'Clientes Totales',
      value: totalClients,
      icon: Users,
      colorClass: 'bg-[--color-primary]', // Azul
    },
    {
      title: 'Cotizaciones Pendientes',
      value: totalQuotes, // Debería filtrarse por estado, pero usamos el total por simplicidad
      icon: DollarSign,
      colorClass: 'bg-yellow-500', // Amarillo de Tailwind
    },
    {
      title: 'Órdenes de Trabajo',
      value: totalWorkOrders,
      icon: ClipboardList,
      colorClass: 'bg-[--color-accent]', // Verde
    },
    {
        title: 'Productos Registrados',
        value: 124, // Dato mockeado, puedes cambiarlo a prisma.products_and_services.count()
        icon: Box,
        colorClass: 'bg-indigo-500', 
      },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[--color-text-main]">Resumen Principal</h1>
      
      {/* Grid de Estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* TABLA: Órdenes de Trabajo Recientes */}
      <section className="mt-8 space-y-4">
        <h2 className="text-2xl font-semibold text-[--color-text-main] border-b pb-2 border-gray-200 dark:border-gray-700">Órdenes de Trabajo Recientes</h2>
        
        <Card className="overflow-x-auto">
          {recentWorkOrders.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-[--color-bg-main]">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--color-text-secondary] uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--color-text-secondary] uppercase tracking-wider">
                    Cliente
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--color-text-secondary] uppercase tracking-wider">
                    Fecha Creación
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--color-text-secondary] uppercase tracking-wider">
                    Total
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[--color-text-secondary] uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentWorkOrders.map((order) => {
                  const statusClasses = getStatusClasses(order.status);
                  // Aseguramos que total_amount_cents sea tratado como número antes de la división
                  const total = (Number(order.total_amount_cents) / 100).toFixed(2);
                  const date = order.created_at?.toLocaleDateString('es-CL');
                  
                  return (
                    <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[--color-primary]">
                        #{order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[--color-text-main]">
                        {/* CORRECCIÓN: Usar client_name para coincidir con el select */}
                        {order.clients.client_name} 
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[--color-text-main]">
                        {date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[--color-text-main]">
                        ${total}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses}`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-10">
              <p className="text-[--color-text-secondary]">No se encontraron órdenes de trabajo recientes.</p>
              <p className="text-sm mt-2 text-[--color-text-secondary]">Crea tu primera orden para verla aquí.</p>
            </div>
          )}
        </Card>
      </section>
    </div>
  );
}