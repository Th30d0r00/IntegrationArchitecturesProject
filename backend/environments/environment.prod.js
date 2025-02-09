const environment = {
  production: true,
  port: 8080,
  defaultAdminPassword: "c3uz#3zd",
  db: {
    host: "iar-mongo.inf.h-brs.de",
    port: 27017,
    username: "team_4",
    password: "team_4!",
    authSource: "team_4",
    name: "team_4",
  },
  corsOrigins: ["http://iar-frontend.inf.h-brs.de"],
};

exports.default = environment;
