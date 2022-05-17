import routes from "../routes";
import ErrorBoundary from "../components/ErrorBoundary";
import { useCurrentChain } from "../contexts/ChainsContext";
import Header from "./Header";
import s from "./App.module.scss";

const App = () => {
  const { chainID } = useCurrentChain();

  return (
    <section className={s.main} key={chainID}>
      <Header />
      <section className={s.content}>
        <ErrorBoundary>{routes}</ErrorBoundary>
      </section>
    </section>
  );
};

export default App;
