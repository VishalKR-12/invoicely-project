import React from "react";
import classNames from "classnames";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-slate-200 text-slate-800",
    secondary: "bg-slate-100 text-slate-700",
    destructive: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
import React from "react";
import classNames from "classnames";

export function Badge({ className, variant = "default", children, ...props }) {
  const variants = {
    default: "bg-slate-200 text-slate-800",
    secondary: "bg-slate-100 text-slate-700",
    destructive: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        variants[variant] || variants.default,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

