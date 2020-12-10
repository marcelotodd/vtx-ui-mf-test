const path = require("path");
const webpackMerge = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react-ts");

module.exports = (webpackConfigEnv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "vtx-ui",
    projectName: "mf-test",
    webpackConfigEnv,
  });

  return webpackMerge.smart(
    {
      ...defaultConfig,
      entry: path.resolve(process.cwd(), `src/vtx-ui-mf-test.tsx`),
      output: {
        filename: `vtx-ui-mf-test.js`,
        libraryTarget: "system",
        path: path.resolve(process.cwd(), "build"),
        jsonpFunction: `webpackJsonp_vtx-ui-mf-test`,
      },
      externals: ["single-spa"],
      devServer: {
        https: true,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        disableHostCheck: true,
      },
    },
    {
      // modify the webpack config however you'd like to by adding to this object
    }
  );
};
