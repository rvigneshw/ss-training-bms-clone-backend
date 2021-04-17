const plugins = [
    {
      register: require('hapi-auth-cookie'),
      options: {},
    }
];

module.exports.plugins = plugins;