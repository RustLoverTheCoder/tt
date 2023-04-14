import UiLoader, { UiLoaderPage } from "./components/common/UiLoader";
import useAppLayout from "./hooks/useAppLayout";

function App() {
  const { isMobile } = useAppLayout();
  let activeKey: number;
  let page: UiLoaderPage | undefined;
  page = "main";

  return (
    <UiLoader key="Loader" page={page} isMobile={isMobile}>
      <div>123</div>
    </UiLoader>
  );
}

export default App;
