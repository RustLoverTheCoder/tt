import type { FC } from "react";

import clsx from "clsx";
import styles from "./MenuSeparator.module.scss";

type OwnProps = {
  className?: string;
};

const MenuSeparator: FC<OwnProps> = ({ className }) => {
  return <div className={clsx(styles.root, className)} />;
};

export default MenuSeparator;
