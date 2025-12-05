import React from "react";
import classNames from "classnames";

export function Table({ className, ...props }) {
  return <table className={classNames("w-full border-collapse", className)} {...props} />;
}

export function TableHeader({ className, ...props }) {
  return <thead className={classNames("", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={classNames("", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={classNames("border-b last:border-0", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return <th className={classNames("text-left px-4 py-3 text-sm font-medium text-slate-500", className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={classNames("px-4 py-3 text-sm", className)} {...props} />;
}
import React from "react";
import classNames from "classnames";

export function Table({ className, ...props }) {
  return <table className={classNames("w-full border-collapse", className)} {...props} />;
}

export function TableHeader({ className, ...props }) {
  return <thead className={classNames("", className)} {...props} />;
}

export function TableBody({ className, ...props }) {
  return <tbody className={classNames("", className)} {...props} />;
}

export function TableRow({ className, ...props }) {
  return <tr className={classNames("border-b last:border-0", className)} {...props} />;
}

export function TableHead({ className, ...props }) {
  return <th className={classNames("text-left px-4 py-3 text-sm font-medium text-slate-500", className)} {...props} />;
}

export function TableCell({ className, ...props }) {
  return <td className={classNames("px-4 py-3 text-sm", className)} {...props} />;
}

