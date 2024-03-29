const webpack = require("webpack");
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      return {
        ...webpackConfig,
        entry: {
          main: [
            env === "development" && require.resolve("react-dev-utils/webpackHotDevClient"),
            paths.appIndexJs
          ].filter(Boolean),
          content: "./src/chromeServices/DOMContent.ts",
          background: "./src/chromeServices/DOMBackground.ts"
        },
        output: {
          ...webpackConfig.output,
          filename: "static/js/[name].js"
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false
        },
        plugins: (webpackConfig.plugins || []).concat([
          new webpack.ProvidePlugin({
            process: "process/browser",
            Buffer: ["buffer", "Buffer"]
          })
        ])
      };
    }
  }
};
