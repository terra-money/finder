import "react-app-polyfill/ie9";
import "core-js";
import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.scss";
import App from "./layouts/App";
import * as serviceWorker from "./serviceWorker";
import { getChains, ChainsProvider } from "./contexts/ChainsContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false }
  }
});

getChains().then(chains => {
  ReactDOM.render(
    <BrowserRouter>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <ChainsProvider value={chains}>
            <Routes>
              <Route path="/*" element={<App />} />
              <Route path=":network/*" element={<App />} />
            </Routes>
          </ChainsProvider>
        </QueryClientProvider>
      </RecoilRoot>
    </BrowserRouter>,
    document.getElementById("root")
  );
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
