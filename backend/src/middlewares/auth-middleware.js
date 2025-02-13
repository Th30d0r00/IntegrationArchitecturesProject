/**
 * this express middleware checks if a user is authenticated or even has admin permissions;
 * otherwise the request gets intercepted and status 401 is returned
 * @param {boolean} beAdmin if true, user needs to be admin
 * @return {(function(*, *, *): void)|*}
 */
exports.checkAuthorization = (beAdmin) => {
  return (req, res, next) => {
    console.log(req.session);
    if (req.session.authenticated) {
      //check if session was marked as authenticated
      if (!beAdmin || req.session.user.isAdmin) {
        //check if admin-requirement is met
        next(); //proceed with next middleware or handler
        return;
      }
    }
    res.status(401).send(); //intercept request
  };
};

/**
 * this express middleware checks if a user is authenticated or even has admin permissions;
 * otherwise the request gets intercepted and status 401 is returned
 * @param {string[]} roles the roles that are required
 * @param {string} roleWithSid the role that is required and must match the session user's sid
 * @return {(function(*, *, *): void)|*}
 */
exports.checkAuthorizationWithRolesAndSid = (roles, roleWithSid) => {
  return (req, res, next) => {
    if (req.session.authenticated) {
      //check if session was marked as authenticated
      if (
        roles.includes(req.session.user.role) &&
        (!(req.session.user.role === roleWithSid) ||
          (req.session.user.role === roleWithSid &&
            req.session.user.sid == req.params.sid))
      ) {
        //check if admin-requirement is met
        next(); //proceed with next middleware or handler
        return;
      }
    }
    res.status(401).send(); //intercept request
  };
};
