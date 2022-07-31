const withTM = require("next-transpile-modules")(["ui", "@dymock/url-builder"]);

module.exports = withTM({
  reactStrictMode: true,
});
