import React, { forwardRef } from "react";
import classNames from "classnames";

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export const Button = forwardRef(
  ({ className, variant = "default", size = "md", asChild, children, ...props }, ref) => {
    const variants = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700",
      outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
      ghost: "text-slate-600 hover:bg-slate-100",
    };
    const sizes = {
      sm: "h-8 px-3 py-1",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-6 py-2.5",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        ref={ref}
        className={classNames(baseClasses, variants[variant] || variants.default, sizes[size] || sizes.md, className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";
import React, { forwardRef } from "react";
import classNames from "classnames";

const baseClasses =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

export const Button = forwardRef(
  ({ className, variant = "default", size = "md", asChild, children, ...props }, ref) => {
    const variants = {
      default: "bg-indigo-600 text-white hover:bg-indigo-700",
      outline: "border border-slate-200 text-slate-700 hover:bg-slate-50",
      ghost: "text-slate-600 hover:bg-slate-100",
    };
    const sizes = {
      sm: "h-8 px-3 py-1",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-6 py-2.5",
      icon: "h-10 w-10",
    };

    const Comp = asChild ? "span" : "button";

    return (
      <Comp
        ref={ref}
        className={classNames(baseClasses, variants[variant] || variants.default, sizes[size] || sizes.md, className)}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

