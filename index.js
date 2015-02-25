// Rate limits (set a variable to 0 to disregard that limit)
var daily_total = 100;
var daily_all_users = 100;
var daily_per_user = 10;
var hourly_total = 20;
var hourly_all_users = 20;
var hourly_per_user = 5;

var config = [daily_total, daily_all_users, daily_per_user,
              hourly_total, hourly_all_users, hourly_per_user];
// Run service
var server = require("./cluster.js");
server.runCluster(config);
