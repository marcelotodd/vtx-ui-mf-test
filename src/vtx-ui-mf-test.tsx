import "./set-public-path";
import * as React from "react";
import * as ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import { Root } from "./root.component";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary(err, info, props) {
    return null;
  },
});

export const { bootstrap, unmount } = lifecycles;
export const mount = async (props) => {
  const delay = parseInt(localStorage.getItem("vtx-ui-mf-test:delay"));
  if (delay) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }
  lifecycles.mount(props);
};
