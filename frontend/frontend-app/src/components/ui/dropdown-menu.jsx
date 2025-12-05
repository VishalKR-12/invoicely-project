import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import classNames from "classnames";

const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children, ...props }) {
  const ctx = useContext(DropdownContext);
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

export function DropdownMenuContent({ children, className, align = "start", ...props }) {
  const ctx = useContext(DropdownContext);
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
        "absolute z-50 mt-2 min-w-[10rem] rounded-md border border-slate-200 bg-white p-2 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ onClick, children, className, ...props }) {
  return (
    <div
      role="menuitem"
      onClick={onClick}
      className={classNames("cursor-pointer rounded px-2 py-1 text-sm hover:bg-slate-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}
import React, { createContext, useContext, useState, useRef, useEffect } from "react";
import classNames from "classnames";

const DropdownContext = createContext(null);

export function DropdownMenu({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({ asChild, children, ...props }) {
  const ctx = useContext(DropdownContext);
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

export function DropdownMenuContent({ children, className, align = "start", ...props }) {
  const ctx = useContext(DropdownContext);
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
        "absolute z-50 mt-2 min-w-[10rem] rounded-md border border-slate-200 bg-white p-2 shadow-lg",
        align === "end" ? "right-0" : "left-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ onClick, children, className, ...props }) {
  return (
    <div
      role="menuitem"
      onClick={onClick}
      className={classNames("cursor-pointer rounded px-2 py-1 text-sm hover:bg-slate-100", className)}
      {...props}
    >
      {children}
    </div>
  );
}

