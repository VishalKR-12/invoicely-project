import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import classNames from "classnames";

const PopoverContext = createContext(null);

export function Popover({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ asChild, children, ...props }) {
  const ctx = useContext(PopoverContext);
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      onClick: () => ctx?.setOpen(!ctx.open),
      ...props,
    });
  }
  return (
    <button type="button" onClick={() => ctx?.setOpen(!ctx.open)} {...props}>
      {children}
    </button>
  );
}

export function PopoverContent({ className, align = "start", children, ...props }) {
  const ctx = useContext(PopoverContext);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) ctx?.setOpen(false);
    };
    if (ctx?.open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ctx]);

  if (!ctx?.open) return null;

  return (
    <div
      ref={ref}
      className={classNames(
        "absolute z-50 mt-2 w-64 rounded-md border border-slate-200 bg-white p-3 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import classNames from "classnames";

const PopoverContext = createContext(null);

export function Popover({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ asChild, children, ...props }) {
  const ctx = useContext(PopoverContext);
  const Comp = asChild ? React.Fragment : "button";
  const content = (
    <button type="button" onClick={() => ctx?.setOpen(!ctx.open)} {...props}>
      {children}
    </button>
  );
  return asChild ? React.cloneElement(children, { onClick: () => ctx?.setOpen(!ctx.open) }) : content;
}

export function PopoverContent({ className, align = "start", children, ...props }) {
  const ctx = useContext(PopoverContext);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) ctx?.setOpen(false);
    };
    if (ctx?.open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [ctx]);

  if (!ctx?.open) return null;

  return (
    <div
      ref={ref}
      className={classNames(
        "absolute z-50 mt-2 w-64 rounded-md border border-slate-200 bg-white p-3 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

