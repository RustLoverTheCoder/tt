import React, { memo, FC } from "react";

import Spinner from "./Spinner";
import clsx from "clsx";
import "./Loading.css";

type OwnProps = {
  color?: "blue" | "white" | "black" | "yellow";
  backgroundColor?: "light" | "dark";
  onClick?: NoneToVoidFunction;
};

const Loading: FC<OwnProps> = ({
  color = "blue",
  backgroundColor,
  onClick,
}) => {
  return (
    <div
      className={clsx("Loading", onClick && "interactive")}
      onClick={onClick}
    >
      <Spinner color={color} backgroundColor={backgroundColor} />
    </div>
  );
};

export default memo(Loading);
