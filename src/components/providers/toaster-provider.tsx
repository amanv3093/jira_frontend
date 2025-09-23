import { toast  } from "sonner";
import { Check, X, Info, AlertTriangle } from "lucide-react"

type ToastType = 'success' | 'error' | 'info' | 'warning'

type ToastOptions = {
  message: string
  description?: string
}

const getToastConfig = (type: ToastType) => {
  const configs = {
    success: {
      icon: Check,
      className: "bg-green-100 border-l-4 border-l-green-600 shadow-md",
      title: "Success",
      iconColor: "text-green-600",
      circleColor: "bg-green-200",
      circleBorder: "border-green-600"
    },
    error: {
      icon: X,
      className: "bg-red-100 border-l-4 border-l-red-600 shadow-md",
      title: "Error",
      iconColor: "text-red-600",
      circleColor: "bg-red-200",
      circleBorder: "border-red-600"
    },
    info: {
      icon: Info,
      className: "bg-blue-100 border-l-4 border-l-blue-600 shadow-md",
      title: "Information",
      iconColor: "text-blue-600",
      circleColor: "bg-blue-200",
      circleBorder: "border-blue-600"
    },
    warning: {
      icon: AlertTriangle,
      className: "bg-yellow-100 border-l-4 border-l-yellow-600 shadow-md",
      title: "Warning",
      iconColor: "text-yellow-600",
      circleColor: "bg-yellow-200",
      circleBorder: "border-yellow-600"
    }
  }
  return configs[type]
}

export const useCustomToast = () => {
  // const { toast } = useToast()

  const showToast = {
    success: ({ message, description }: ToastOptions) => {
      const config = getToastConfig('success')
      const Icon = config.icon
      toast({
        title: config.title,
        description: (
          <div className="flex items-center gap-3">
            <div className={`${config.circleColor} ${config.circleBorder} border p-2 rounded-full`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{message}</span>
              {description && <span className="text-sm text-gray-600">{description}</span>}
            </div>
          </div>
        ),
        className: `${config.className} p-4 rounded-lg`,
      })
    },

    error: ({ message, description }: ToastOptions) => {
      const config = getToastConfig('error')
      const Icon = config.icon
      toast({
        title: config.title,
        description: (
          <div className="flex items-center gap-3">
            <div className={`${config.circleColor} ${config.circleBorder} border p-2 rounded-full`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{message}</span>
              {description && <span className="text-sm text-gray-600">{description}</span>}
            </div>
          </div>
        ),
        className: `${config.className} p-4 rounded-lg`,
      })
    },

    info: ({ message, description }: ToastOptions) => {
      const config = getToastConfig('info')
      const Icon = config.icon
      toast({
        title: config.title,
        description: (
          <div className="flex items-center gap-3">
            <div className={`${config.circleColor} ${config.circleBorder} border p-2 rounded-full`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{message}</span>
              {description && <span className="text-sm text-gray-600">{description}</span>}
            </div>
          </div>
        ),
        className: `${config.className} p-4 rounded-lg`,
      })
    },

    warning: ({ message, description }: ToastOptions) => {
      const config = getToastConfig('warning')
      const Icon = config.icon
      toast({
        title: config.title,
        description: (
          <div className="flex items-center gap-3">
            <div className={`${config.circleColor} ${config.circleBorder} border p-2 rounded-full`}>
              <Icon className={`h-6 w-6 ${config.iconColor}`} />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">{message}</span>
              {description && <span className="text-sm text-gray-600">{description}</span>}
            </div>
          </div>
        ),
        className: `${config.className} p-4 rounded-lg`,
      })
    }
  }

  return showToast
}