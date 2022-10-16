import React, { createContext, useEffect, useState, useContext } from "react";

import APIContext from './APIProvider.js';


export const PronoContext = createContext('wk2022');


function PronoProvider(props) {
  const [prono, setProno] = useState('wk2022');

  const api = useContext(APIContext);

  useEffect(() => {
    api.onActivePronoChanged(prono => setProno(prono));
  }, [api]);

  return (
    <PronoContext.Provider value={prono}>
      {props.children}
    </PronoContext.Provider>
  );
}

export default PronoProvider;