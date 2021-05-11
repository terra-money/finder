import React from "react";
import s from "./Index.module.scss";
import Search from "../../components/Search";
import SelectNetworks from "../../components/SelectNetworks";
import SelectCurrency from "../../components/SelectCurrency";

const Index = () => {
  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.logo}>
          <img
            src="https://s3.ap-northeast-2.amazonaws.com/terra.money.home/static/finder/logo.svg"
            alt=""
          />
        </div>
        <Search className={s.search} />
      </div>
      <SelectNetworks className={s.networks} />
      <SelectCurrency className={s.currency} />
      <div className={s.cover} />
      <video
        playsInline
        autoPlay
        muted
        loop
        className={s.background}
        poster="https://s3.ap-northeast-2.amazonaws.com/terra.money.home/static/finder/terrafinder.jpg"
      >
        <source
          src="https://s3.ap-northeast-2.amazonaws.com/terra.money.home/static/finder/terrafinder.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default Index;
