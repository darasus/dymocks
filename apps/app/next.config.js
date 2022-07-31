const withTM = require("next-transpile-modules")(["ui", "prisma"]);

module.exports = withTM({
  reactStrictMode: true,
});
