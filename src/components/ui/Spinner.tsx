import React, { FC } from "react";

import clsx from "clsx";
import "./Spinner.css";

const Spinner: FC<{
  color?: "blue" | "white" | "black" | "green" | "gray" | "yellow";
  backgroundColor?: "light" | "dark";
  className?: string;
}> = ({ color = "blue", backgroundColor, className }) => {
  return (
    <div
      className={clsx(
        "Spinner",
        className,
        color,
        backgroundColor && "with-background",
        backgroundColor && `bg-${backgroundColor}`
      )}
    >
      <div />
    </div>
  );
};

export default Spinner;
