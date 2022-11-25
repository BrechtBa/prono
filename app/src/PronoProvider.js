import React, { createContext } from "react";


export const PronoContext = createContext('wk2022');


function PronoProvider(props) {
  const api = props.api;
  const prono = api.useActiveProno('wk2022');

  return (
    <PronoContext.Provider value={prono}>
      {props.children}
    </PronoContext.Provider>
  );
}

export default PronoProvider;