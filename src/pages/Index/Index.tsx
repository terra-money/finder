import React from "react";
import s from "./Index.module.scss";
import Search from "../../components/Search";
import logo from "../../images/logo.svg";
import terrafinder from "../../images/terrafinder.jpg";
import backgroundVideo from "../../videos/terrafinder.mp4";
import SelectOptions from "../../components/SelectOptions";

const Index = () => (
  <div className={s.container}>
    <div className={s.content}>
      <div className={s.logo}>
        <img src={logo} alt="logo" />
      </div>
      <Search className={s.search} />
      <SelectOptions />
    </div>
    <div className={s.cover} />
    <video
      playsInline
      autoPlay
      muted
      loop
      className={s.background}
      poster={terrafinder}
    >
      <source src={backgroundVideo} type="video/mp4" />
    </video>
  </div>
);

export default Index;
