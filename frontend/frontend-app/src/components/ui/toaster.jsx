import React, { useContext } from "react";
import classNames from "classnames";
import { ToastContext } from "./use-toast";

export function Toaster() {
  const ctx = useContext(ToastContext);
  if (!ctx) return null;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col gap-2 z-50">
      {ctx.toasts.map((toast) => (
        <div
          key={toast.id}
          className={classNames(
            "w-72 rounded-md border bg-white p-3 shadow-lg",
            toast.variant === "destructive" ? "border-red-200" : "border-slate-200"
          )}
        >
          <p className="text-sm font-semibold text-slate-800">{toast.title}</p>
          {toast.description && <p className="text-xs text-slate-500 mt-1">{toast.description}</p>}
        </div>
      ))}
    </div>
  );
}

