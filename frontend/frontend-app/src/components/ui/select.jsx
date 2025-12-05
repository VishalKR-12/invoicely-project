import React, { createContext, useContext, useState } from "react";
import classNames from "classnames";

const SelectContext = createContext(null);

export function Select({ value, onValueChange, defaultValue, children }) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const current = value ?? internal;

  const setValue = (val) => {
    setInternal(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: current, setValue, open, setOpen }}>
      <div className="relative">{children}</div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }) {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => ctx?.setOpen(!ctx.open)}
      className={classNames(
        "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx?.value || placeholder}</span>;
}

export function SelectContent({ className, children, ...props }) {
  const ctx = useContext(SelectContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={classNames(
        "absolute mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md p-1 z-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className, ...props }) {
  const ctx = useContext(SelectContext);
  const active = ctx?.value === value;
  return (
    <div
      role="option"
      onClick={() => ctx?.setValue(value)}
      className={classNames(
        "cursor-pointer rounded px-2 py-1 text-sm hover:bg-slate-100",
        active && "bg-slate-100 font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
import React, { createContext, useContext, useState } from "react";
import classNames from "classnames";

const SelectContext = createContext(null);

export function Select({ value, onValueChange, defaultValue, children }) {
  const [internal, setInternal] = useState(defaultValue ?? "");
  const [open, setOpen] = useState(false);
  const current = value ?? internal;

  const setValue = (val) => {
    setInternal(val);
    onValueChange?.(val);
    setOpen(false);
  };

  return (
    <SelectContext.Provider value={{ value: current, setValue, open, setOpen }}>
      {children}
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }) {
  const ctx = useContext(SelectContext);
  return (
    <button
      type="button"
      onClick={() => ctx?.setOpen(!ctx.open)}
      className={classNames(
        "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function SelectValue({ placeholder }) {
  const ctx = useContext(SelectContext);
  return <span>{ctx?.value || placeholder}</span>;
}

export function SelectContent({ className, children, ...props }) {
  const ctx = useContext(SelectContext);
  if (!ctx?.open) return null;
  return (
    <div
      className={classNames(
        "mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md p-1 z-50",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className, ...props }) {
  const ctx = useContext(SelectContext);
  const active = ctx?.value === value;
  return (
    <div
      role="option"
      onClick={() => ctx?.setValue(value)}
      className={classNames(
        "cursor-pointer rounded px-2 py-1 text-sm hover:bg-slate-100",
        active && "bg-slate-100 font-semibold",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

