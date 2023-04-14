import { memo, FC } from "react";

const LockScreen: FC<{ isLocked: boolean | undefined }> = () => {
  return <div>LockScreen</div>;
};

export default memo(LockScreen);
