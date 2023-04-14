import type { FC, ReactNode } from "react";

export type UiLoaderPage =
  | "main"
  | "lock"
  | "inactive"
  | "authCode"
  | "authPassword"
  | "authPhoneNumber"
  | "authQrCode";

const UiLoader: FC<{
  children: ReactNode;
  page: UiLoaderPage;
  isMobile: boolean | undefined;
}> = ({ children }) => {
  return <div id="UiLoader">{children}</div>;
};

export default UiLoader;
