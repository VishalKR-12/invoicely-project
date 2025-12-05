import React from "react";
import classNames from "classnames";

export function Card({ className, children, ...props }) {
  return (
    <div className={classNames("rounded-lg border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={classNames("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={classNames("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={classNames("p-4 pt-0", className)} {...props}>
      {children}
    </div>
  );
}
import React from "react";
import classNames from "classnames";

export function Card({ className, children, ...props }) {
  return (
    <div className={classNames("rounded-lg border border-slate-200 bg-white shadow-sm dark:bg-slate-900 dark:border-slate-800", className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={classNames("p-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3 className={classNames("text-lg font-semibold leading-none tracking-tight", className)} {...props}>
      {children}
    </h3>
  );
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={classNames("p-4 pt-0", className)} {...props}>
      {children}
    </div>
  );
}

