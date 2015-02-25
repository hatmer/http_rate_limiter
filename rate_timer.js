var DEBUG = false;

/*  config: [daily_total, daily_all_users, daily_per_user,           
 *           hourly_total, hourly_all_users, hourly_per_user]
 */          
 
var limiter = function (config) {

  // count variables
  var remaining_dt = 0;
  var remaining_dau = 0;
  var remaining_ht = 0;
  var remaining_hau = 0;
  userCounts = {};

  // daily and hourly interval refreshes
  var hour = 3600000;
  var day = 86400000;
  
  this.reset_days = function () {
    if (DEBUG) {console.log("resetting days");}
    remaining_dt = config[0];
    remaining_dau = config[1];
    for (user in userCounts) {
      userCounts[user][0] = config[2];
    }
  }
  this.reset_hours = function () {
    if (DEBUG) {console.log("resetting hours");}
    console.log(userCounts);
    remaining_ht = config[3];
    remaining_hau = config[4];
    for (user in userCounts) {
      userCounts[user][1] = config[5];
    }
  }

  this.reset_days();
  this.reset_hours();

  this.d_reset = setInterval(this.reset_days, day);
  this.h_reset = setInterval(this.reset_hours, hour);

  this.checkLimits = function (user_id) {
    
    // check for new user
    if (!(user_id in userCounts)) { 
      if (DEBUG) {console.log("adding new user: " + user_id);}
      userCounts[user_id] = [config[2],config[5]];
    }

    // check limits
    if (userCounts[user_id][0] > 0 && userCounts[user_id][1] > 0 &&
        remaining_dt > 0 && remaining_ht > 0 && 
        remaining_dau > 0 && remaining_hau > 0) { 
    
      // update number of request tallies
      remaining_dt -= 1;
      remaining_dau -= 1;
      remaining_ht -= 1;
      remaining_hau -= 1;
      userCounts[user_id][0] -=1;
      userCounts[user_id][1] -= 1;
      console.log(remaining_ht);
      return true;
    }
    return false;
  }
}

exports.limiter = limiter;
