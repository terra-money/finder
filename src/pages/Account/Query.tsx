import React, { FormEvent, useState } from "react";
import { useParams } from "react-router-dom";
import "ace-builds";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-github";
import AceEditor from "react-ace";
import c from "classnames";
import apiClient from "../../apiClient";
import { isJson } from "../../scripts/utility";
import { useFCDURL } from "../../contexts/ChainsContext";
import Copy from "../../components/Copy";
import Icon from "../../components/Icon";
import s from "./Query.module.scss";

const ACE_PROPS = {
  mode: "json",
  theme: "github",
  name: "JSON",
  width: "100%",
  height: "160px",
  autoComplete: "off",
  className: "form-control",
  showGutter: false,
  highlightActiveLine: false,
  editorProps: { $blockScrolling: true }
};

const Query = () => {
  const { address = "" } = useParams();
  const [query, setQuery] = useState<string>();
  const [data, setData] = useState<string>();
  const [error, setError] = useState<Error>();

  const fcdURL = useFCDURL();

  const reset = () => {
    setError(undefined);
    setQuery(undefined);
    setData(undefined);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const url = `${fcdURL}/wasm/contracts/${address}/store`;
      const params = query && { query_msg: JSON.parse(query) };
      const { data } = await apiClient.get<{ result: any }>(url, { params });
      const result = JSON.stringify(data.result, null, 2);

      setData(result);
    } catch (error) {
      setError(error);
    }
  };

  return error ? (
    <>
      <button className={s.back} onClick={reset}>
        <Icon size={20} name="arrow_back" />
      </button>

      <header className={s.header}>
        <Icon size={50} className={s.errorIcon} name="error_outline" />
        <h1 className={c(s.title, s.errorTitle)}>Error</h1>
      </header>

      <section className={c(s.errorMassage, s.inner)}>{error.message}</section>
    </>
  ) : data ? (
    <>
      <button className={s.back} onClick={reset}>
        <Icon size={20} name="arrow_back" />
      </button>

      <header>
        <h1 className={c(s.title, s.mainTitle)}>Query Result</h1>
      </header>

      <section className={s.inner}>
        <article className={s.innerHeader}>
          <h2 className={c(s.title, s.subTitle)}>JSON Output</h2>
          <Copy
            text={data}
            buttonLabel="COPY"
            classNames={{ button: s.copyButton, wrapper: s.copyWrapper }}
          />
        </article>

        <section className={s.result}>{data}</section>
      </section>
    </>
  ) : (
    <>
      <header>
        <h1 className={c(s.title, s.mainTitle)}>Query</h1>
      </header>

      <section>
        <form className={s.inner} onSubmit={submit}>
          <h2 className={c(s.title, s.subTitle)}>Contract Address</h2>
          <input readOnly value={address} className={s.address} />
          <h2 className={c(s.title, s.subTitle)}>QueryMsg JSON</h2>

          <AceEditor
            {...ACE_PROPS}
            onChange={setQuery}
            onLoad={editor => {
              editor.renderer.setPadding(15);
              editor.renderer.setScrollMargin(15, 15, 15, 15);
            }}
          />

          <button
            className={
              isJson(query) ? s.nextButton : c(s.nextButton, s.disabled)
            }
            disabled={!isJson(query)}
            type="submit"
          >
            Next
          </button>
        </form>
      </section>
    </>
  );
};

export default Query;
