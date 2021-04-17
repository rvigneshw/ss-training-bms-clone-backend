const Models = require('./models')
const cookieAuthStrategy = {
    name: 'session',
    options: {
      cookie: 'spid',
      ttl: 365 * 30 * 7 * 24 * 60 * 60 * 1000, //Some random value on internet
      password: "shdbsadabsdksdnaskndajksndaskdasjkdnasjkndsakjndjkasbdjkas",
      /*TODO: 
        * need to set {isSameSite:'Strict'} later for security reasons to prevent XSRF attack(raised in VAPT) @Balaji C M
        * on setting {isSameSite:'Strict'}, need to find a way to send cookies to admin app login when redirecting from "surveysparrow.com" website
      */
      isSameSite: false,
      isHttpOnly: true,
      isSecure: false,
      // domain: config.domain,
      validateFunc(request, session, callback) {
        
        if (session.id) {
            callback(null, true, session);
        }else{
            callback(null, false, session);
        }
        
        // callback(err, isValid, credentials)
        // acts as a filter for all requests to / and /dashboard and reads cookie from  cookie and finds out session
        // check if session is valid, if not null is passed as credentials, and not authenticated response is sent
        // if valid pass, session object as credentials and is authenticated as true.
        // controllers.account.getSession(credentials.token, request.account, (err, session) => {
        //   if (err || session === null || session.active === false || session.user.account.id !== request.account.id) {
        //     callback(null, false, credentials);
        //   } else {
        //     credentials.session = session; // utils.getSessionDTO(session);
        //     request.session = session;
        //     request.isAuthenticated = true;
        //     callback(null, true, credentials);
        //   }
        // });
      },
    },
}

module.exports.cookieAuthStrategy = cookieAuthStrategy;