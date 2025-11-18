import { useState } from 'react';
import { usePlans, useCreatePlan, useUpdatePlan, useDeletePlan, useAdminPayments } from '../../hooks/usePlans';
import { Button, Card, CardContent, Loading, Modal } from '../../components/ui';
import { StatCard } from '../../components/ui/StatCard';
import { PlanForm } from '../../components/forms/PlanForm';
import { useToast } from '../../stores/toastStore';
import { Plus, Edit, Trash2, CheckCircle, XCircle, CreditCard, TrendingUp, DollarSign, Star } from 'lucide-react';
import { MembershipPlan } from '../../types/plan.types';
import { AxiosErrorType } from '../../types/error.types';
import { MembershipType } from '../../types/membership.types';

export const AdminPlansPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<MembershipPlan | null>(null);

  const { data: plans, isLoading } = usePlans();
  const { data: payments } = useAdminPayments();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();
  const deletePlan = useDeletePlan();
  const toast = useToast();

  const handleToggleStatus = (planId: string, currentStatus: boolean) => {
    updatePlan.mutate({
      id: planId,
      data: { activo: !currentStatus },
    }, {
      onSuccess: () => {
        toast.success(currentStatus ? 'Plan desactivado' : 'Plan activado');
      },
      onError: () => {
        toast.error('Error al cambiar el estado del plan');
      },
    });
  };

  const handleToggleDestacado = (planId: string, currentDestacado: boolean) => {
    updatePlan.mutate({
      id: planId,
      data: { destacado: !currentDestacado },
    }, {
      onSuccess: () => {
        toast.success(currentDestacado ? 'Plan desmarcado como destacado' : 'Plan marcado como destacado');
      },
      onError: () => {
        toast.error('Error al cambiar el plan destacado');
      },
    });
  };

  const handleDeletePlan = (planId: string, planName: string) => {
    if (confirm(`¿Estás seguro de que querés eliminar "${planName}"?`)) {
      deletePlan.mutate(planId, {
        onSuccess: () => {
          toast.success('Plan eliminado correctamente');
        },
        onError: () => {
          toast.error('Error al eliminar el plan');
        },
      });
    }
  };

  interface PlanFormData {
    nombre: string;
    descripcion: string;
    tipo: MembershipType;
    precio: number;
    duracionDias: number;
    beneficios: string[];
    destacado: boolean;
    orden: number;
  }

  const handleCreatePlan = async (data: PlanFormData) => {
    try {
      await createPlan.mutateAsync(data);
      setIsModalOpen(false);
      toast.success('Plan creado correctamente');
    } catch (error: AxiosErrorType) {
      toast.error(error.response?.data?.message || 'Error al crear el plan');
    }
  };

  const handleEditPlan = async (data: PlanFormData) => {
    if (!editingPlan) return;
    try {
      await updatePlan.mutateAsync({
        id: editingPlan.id,
        data,
      });
      setIsModalOpen(false);
      setEditingPlan(null);
      toast.success('Plan actualizado correctamente');
    } catch (error: AxiosErrorType) {
      toast.error(error.response?.data?.message || 'Error al actualizar el plan');
    }
  };

  const openCreateModal = () => {
    setEditingPlan(null);
    setIsModalOpen(true);
  };

  const openEditModal = (plan: MembershipPlan) => {
    setEditingPlan(plan);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const getPlanDuration = (duracionDias: number) => {
    if (duracionDias === 30) return '1 mes';
    if (duracionDias === 90) return '3 meses';
    if (duracionDias === 180) return '6 meses';
    if (duracionDias === 365) return '12 meses';
    return `${duracionDias} días`;
  };

  const totalRevenue = payments?.reduce((sum, payment) =>
    payment.status === 'approved' ? sum + Number(payment.amount) : sum, 0
  ) || 0;

  const approvedPayments = payments?.filter(p => p.status === 'approved').length || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Planes</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Administrá los planes de membresía</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Planes"
          value={plans?.length || 0}
          icon={CreditCard}
          iconColor="blue"
          size="sm"
        />

        <StatCard
          label="Planes Activos"
          value={plans?.filter(p => p.activo).length || 0}
          icon={CheckCircle}
          iconColor="green"
          size="sm"
        />

        <StatCard
          label="Ventas Totales"
          value={approvedPayments}
          icon={TrendingUp}
          iconColor="purple"
          size="sm"
        />

        <StatCard
          label="Ingresos"
          value={`$${totalRevenue.toLocaleString('es-AR')}`}
          icon={DollarSign}
          iconColor="green"
          size="sm"
        />
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {plans?.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.destacado ? 'ring-2 ring-blue-500' : ''}`}>
            <CardContent className="p-4">
              <div className="space-y-3">
                {plan.destacado && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    <Star className="w-3 h-3 inline mr-1" />
                    DESTACADO
                  </div>
                )}

                <div className="flex items-start justify-between pt-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{plan.nombre}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                      {plan.descripcion}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <button
                      onClick={() => handleToggleStatus(plan.id, plan.activo)}
                      className={`p-1 rounded ${
                        plan.activo ? 'text-green-600' : 'text-gray-400'
                      }`}
                      title={plan.activo ? 'Activo' : 'Inactivo'}
                    >
                      {plan.activo ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${plan.precio.toLocaleString('es-AR')}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getPlanDuration(plan.duracionDias)}
                  </span>
                </div>

                <div className="space-y-1">
                  {plan.beneficios?.slice(0, 3).map((beneficio, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-gray-700">{beneficio}</span>
                    </div>
                  ))}
                  {plan.beneficios?.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{plan.beneficios.length - 3} más
                    </span>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Orden: {plan.orden}</span>
                  <span>{plan.tipo}</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleDestacado(plan.id, plan.destacado)}
                    className="flex-1"
                  >
                    <Star className={`w-4 h-4 mr-1 ${plan.destacado ? 'fill-current' : ''}`} />
                    {plan.destacado ? 'Quitar' : 'Destacar'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(plan)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletePlan(plan.id, plan.nombre)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans?.length === 0 && (
        <div className="text-center py-12">
          <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay planes creados
          </h3>
          <p className="text-gray-600 mb-4">
            Creá tu primer plan de membresía para empezar a recibir pagos online
          </p>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Plan
          </Button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
      >
        <PlanForm
          onSubmit={editingPlan ? handleEditPlan : handleCreatePlan}
          onCancel={closeModal}
          isLoading={createPlan.isPending || updatePlan.isPending}
          initialData={editingPlan || undefined}
          isEdit={!!editingPlan}
        />
      </Modal>
    </div>
  );
};

export default AdminPlansPage;
