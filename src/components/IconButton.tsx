import clsx from "clsx";
import React from "react";

interface Props {
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  className?: string;
}

export const IconButton: React.FC<Props> = ({
  onClick,
  children,
  className,
}) => {
  return (
    <button className={clsx("cursor-pointer p-1", className)} onClick={onClick} type="button">
      {children}
    </button>
  );
};
