import React, { createContext, useContext, useState } from "react";
import classNames from "classnames";

const TabsContext = createContext(null);

export function Tabs({ value: controlledValue, onValueChange, defaultValue, children, className }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;

  const setValue = (val) => {
    setUncontrolled(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children, ...props }) {
  return (
    <div className={classNames("inline-flex items-center gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800", className)} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={classNames(
        "px-3 py-2 text-sm rounded-md transition-colors",
        active ? "bg-white shadow dark:bg-slate-700" : "text-slate-500 dark:text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return (
    <div className={classNames(className)} {...props}>
      {children}
    </div>
  );
}
import React, { createContext, useContext, useState } from "react";
import classNames from "classnames";

const TabsContext = createContext(null);

export function Tabs({ value: controlledValue, onValueChange, defaultValue, children, className }) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;

  const setValue = (val) => {
    setUncontrolled(val);
    onValueChange?.(val);
  };

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, children, ...props }) {
  return (
    <div className={classNames("inline-flex items-center gap-1 rounded-md bg-slate-100 p-1 dark:bg-slate-800", className)} {...props}>
      {children}
    </div>
  );
}

export function TabsTrigger({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  const active = ctx?.value === value;
  return (
    <button
      type="button"
      onClick={() => ctx?.setValue(value)}
      className={classNames(
        "px-3 py-2 text-sm rounded-md transition-colors",
        active ? "bg-white shadow dark:bg-slate-700" : "text-slate-500 dark:text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, className, children, ...props }) {
  const ctx = useContext(TabsContext);
  if (ctx?.value !== value) return null;
  return (
    <div className={classNames(className)} {...props}>
      {children}
    </div>
  );
}

