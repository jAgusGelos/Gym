import { useState } from "react";
import { usePayments, useCreatePayment } from "../../hooks/useAdmin";
import { Button, Card, CardContent, Loading, Modal } from "../../components/ui";
import { PaymentForm } from "../../components/forms/PaymentForm";
import { useToast } from "../../stores/toastStore";
import {
  DollarSign,
  Plus,
  Calendar,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { PaymentStatus, PaymentMethod } from "../../types/payment.types";

export const PaymentsPage = () => {
  const [filterStatus, setFilterStatus] = useState<"all" | PaymentStatus>(
    "all"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: paymentsData, isLoading } = usePayments(1, 50);
  const createPayment = useCreatePayment();
  const toast = useToast();

  const filteredPayments = paymentsData?.data.filter((payment) => {
    if (filterStatus === "all") return true;
    return payment.estado === filterStatus;
  });

  const totalIngresos =
    paymentsData?.data
      .filter((p) => p.estado === PaymentStatus.COMPLETADO)
      .reduce((sum, p) => sum + p.monto, 0) || 0;

  const totalPendientes =
    paymentsData?.data
      .filter((p) => p.estado === PaymentStatus.PENDIENTE)
      .reduce((sum, p) => sum + p.monto, 0) || 0;

  const getStatusIcon = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETADO:
        return <CheckCircle className="w-4 h-4" />;
      case PaymentStatus.PENDIENTE:
        return <Clock className="w-4 h-4" />;
      case PaymentStatus.RECHAZADO:
        return <XCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETADO:
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case PaymentStatus.PENDIENTE:
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case PaymentStatus.RECHAZADO:
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getMethodIcon = (_method: PaymentMethod) => {
    return <CreditCard className="w-4 h-4" />;
  };

  const handleCreatePayment = async (data: any) => {
    try {
      await createPayment.mutateAsync(data);
      setIsModalOpen(false);
      toast.success("Pago registrado correctamente");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al registrar el pago"
      );
    }
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Gestión de Pagos
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {paymentsData?.total || 0} pagos registrados
          </p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Pago
        </Button>
      </div>

      {/* Resumen financiero */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Ingresos Totales
                </p>
                <p className="text-2xl font-bold text-green-600">
                  ${totalIngresos.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Pendientes
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  ${totalPendientes.toLocaleString("es-AR")}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Total Pagos
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {paymentsData?.total || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filterStatus === "all" ? "primary" : "outline"}
              size="sm"
              onClick={() => setFilterStatus("all")}
            >
              Todos
            </Button>
            <Button
              variant={
                filterStatus === PaymentStatus.COMPLETADO
                  ? "primary"
                  : "outline"
              }
              size="sm"
              onClick={() => setFilterStatus(PaymentStatus.COMPLETADO)}
            >
              Completados
            </Button>
            <Button
              variant={
                filterStatus === PaymentStatus.PENDIENTE ? "primary" : "outline"
              }
              size="sm"
              onClick={() => setFilterStatus(PaymentStatus.PENDIENTE)}
            >
              Pendientes
            </Button>
            <Button
              variant={
                filterStatus === PaymentStatus.RECHAZADO ? "primary" : "outline"
              }
              size="sm"
              onClick={() => setFilterStatus(PaymentStatus.RECHAZADO)}
            >
              Rechazados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de pagos */}
      {isLoading ? (
        <Loading className="py-12" />
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {filteredPayments?.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-gray-900 dark:text-white">
                          {payment.user?.nombre} {payment.user?.apellido}
                        </p>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded flex items-center gap-1 ${getStatusColor(
                            payment.estado
                          )}`}
                        >
                          {getStatusIcon(payment.estado)}
                          {payment.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {payment.concepto}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(payment.fechaPago).toLocaleDateString(
                            "es-AR"
                          )}
                        </span>
                        <span className="flex items-center gap-1">
                          {getMethodIcon(payment.metodoPago)}
                          {payment.metodoPago}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${payment.monto.toLocaleString("es-AR")}
                    </p>
                  </div>
                </div>
              ))}

              {filteredPayments?.length === 0 && (
                <div className="text-center py-12">
                  <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No se encontraron pagos con el filtro seleccionado
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de registrar pago */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Registrar Nuevo Pago"
        size="lg"
      >
        <PaymentForm
          onSubmit={handleCreatePayment}
          onCancel={closeModal}
          isLoading={createPayment.isPending}
        />
      </Modal>
    </div>
  );
};
