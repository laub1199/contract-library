import React, { useCallback, useEffect } from "react";
import FAQ from "@containers/home/FAQ";

const Home = () => {

  const onFollowBtnClick = useCallback((type) => {
    let url = type === 'twitter' ? 'https://twitter.com/PlayMetaGods' : 'https://discord.gg/playmetagods'
    window.open(url, "_blank")
  }, [])

  return (
    <div>
      <FAQ/>
    </div>
  );
};
export default Home;
