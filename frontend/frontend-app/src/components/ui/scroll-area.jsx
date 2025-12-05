import React from "react";
import classNames from "classnames";

export function ScrollArea({ className, children, ...props }) {
  return (
    <div className={classNames("overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}
import React from "react";
import classNames from "classnames";

export function ScrollArea({ className, children, ...props }) {
  return (
    <div className={classNames("overflow-auto", className)} {...props}>
      {children}
    </div>
  );
}

