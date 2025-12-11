import { toast } from "sonner";
import { Check, X, Info, AlertTriangle } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

type ToastOptions = {
  message: string;
  description?: string;
};

const getToastConfig = (type: ToastType) => {
  return {
    success: {
      icon: Check,
      className: "bg-green-100 border-l-4 border-l-green-600 shadow-md",
      title: "Success",
      iconColor: "text-green-600",
      circleColor: "bg-green-200",
      circleBorder: "border-green-600",
    },
    error: {
      icon: X,
      className: "bg-red-100 border-l-4 border-l-red-600 shadow-md",
      title: "Error",
      iconColor: "text-red-600",
      circleColor: "bg-red-200",
      circleBorder: "border-red-600",
    },
    info: {
      icon: Info,
      className: "bg-blue-100 border-l-4 border-l-blue-600 shadow-md",
      title: "Information",
      iconColor: "text-blue-600",
      circleColor: "bg-blue-200",
      circleBorder: "border-blue-600",
    },
    warning: {
      icon: AlertTriangle,
      className: "bg-yellow-100 border-l-4 border-l-yellow-600 shadow-md",
      title: "Warning",
      iconColor: "text-yellow-600",
      circleColor: "bg-yellow-200",
      circleBorder: "border-yellow-600",
    },
  }[type];
};

export const useCustomToast = () => {
  const showToast = (type: ToastType, { message, description }: ToastOptions) => {
    const config = getToastConfig(type);
    const Icon = config.icon;

    toast(
      <div className={`p-4 rounded-lg ${config.className}`}>
        <div className="flex items-center gap-3">
          <div
            className={`${config.circleColor} ${config.circleBorder} border p-2 rounded-full`}
          >
            <Icon className={`h-6 w-6 ${config.iconColor}`} />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold">{config.title}</span>
            <span className="font-medium">{message}</span>
            {description && (
              <span className="text-sm text-gray-600">{description}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return {
    success: (opts: ToastOptions) => showToast("success", opts),
    error: (opts: ToastOptions) => showToast("error", opts),
    info: (opts: ToastOptions) => showToast("info", opts),
    warning: (opts: ToastOptions) => showToast("warning", opts),
  };
};
