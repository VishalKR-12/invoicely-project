import React from "react";
import classNames from "classnames";

export function Progress({ value = 0, className, indicatorClassName }) {
  return (
    <div className={classNames("w-full h-2 rounded-full bg-slate-200 overflow-hidden", className)}>
      <div
        className={classNames("h-full bg-indigo-600 transition-all", indicatorClassName)}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
import React from "react";
import classNames from "classnames";

export function Progress({ value = 0, className, indicatorClassName }) {
  return (
    <div className={classNames("w-full h-2 rounded-full bg-slate-200 overflow-hidden", className)}>
      <div
        className={classNames("h-full bg-indigo-600 transition-all", indicatorClassName)}
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}

