import React, { createContext, useContext, useState, useCallback } from "react";

export const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ title, description, variant }) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, title, description, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast, toasts }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: () => {} };
  return { toast: ctx.toast };
}

