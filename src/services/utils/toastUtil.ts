import toast, { ToastOptions } from "react-hot-toast";

// Default toast styling with black background and white text
const defaultStyle: React.CSSProperties = {
  background: 'white',
  color: "black",
  fontSize: "0.8rem",
};

// Toast service to show toast notifications
export const toastService = {
  showToast(
    message: string,
    type: "success" | "error" | "loading",
    options?: ToastOptions
  ) {
    // Merge default style with any custom options passed
    const mergedOptions: ToastOptions = {
      ...options,
      style: { ...defaultStyle, ...(options?.style || {}) },
    };

    switch (type) {
      case "success":
        toast.success(message, mergedOptions);
        break;
      case "error":
        toast.error(message, mergedOptions);
        break;
      case "loading":
        toast.loading(message, mergedOptions);
        break;
      default:
        toast(message, mergedOptions);
    }
  },

  // Function to dismiss toast
  dismissToast() {
    toast.dismiss();
  },
};
