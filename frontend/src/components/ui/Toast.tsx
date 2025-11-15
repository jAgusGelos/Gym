import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToastStore, Toast as ToastType } from "../../stores/toastStore";
import { cn } from "../../utils/cn";

const ToastIcon = ({ type }: { type: ToastType["type"] }) => {
  switch (type) {
    case "success":
      return <CheckCircle className="w-5 h-5" />;
    case "error":
      return <XCircle className="w-5 h-5" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5" />;
    case "info":
      return <Info className="w-5 h-5" />;
  }
};

const ToastItem = ({ toast }: { toast: ToastType }) => {
  const removeToast = useToastStore((state) => state.removeToast);

  const typeStyles = {
    success:
      "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400",
    error:
      "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400",
    warning:
      "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
    info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400",
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-slide-in-right",
        typeStyles[toast.type]
      )}
    >
      <ToastIcon type={toast.type} />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
