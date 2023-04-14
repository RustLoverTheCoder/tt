import { memo, FC } from "react";

const Main: FC<{ isMobile: boolean | undefined }> = () => {
  return <div>Main</div>;
};

export default memo(Main);
