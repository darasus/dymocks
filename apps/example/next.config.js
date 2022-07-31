const withTM = require("next-transpile-modules")(["ui", "dymock"]);

module.exports = withTM({
  reactStrictMode: true,
});
