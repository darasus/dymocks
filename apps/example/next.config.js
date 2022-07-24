const withTM = require("next-transpile-modules")(["ui", "@ultra/nextjs"]);

module.exports = withTM({
  reactStrictMode: true,
});
