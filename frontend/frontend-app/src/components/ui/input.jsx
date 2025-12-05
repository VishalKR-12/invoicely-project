import React, { forwardRef } from "react";
import classNames from "classnames";

export const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={classNames(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-slate-900 dark:border-slate-700",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
import React, { forwardRef } from "react";
import classNames from "classnames";

export const Input = forwardRef(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={classNames(
        "flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-offset-white placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:bg-slate-900 dark:border-slate-700",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

