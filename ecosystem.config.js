/* eslint-disable */
module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    dev : {
      user : 'root',
      host : 'XXX.XX.XX.XXX',
      ref  : 'origin/dev',
      repo : '',
      path : '/root/dev/',
      'post-deploy' : 'npm install && npm run build'
    },
    test : {
      user : 'root',
      host : 'XXX.XX.XX.XXX',
      ref  : 'origin/master',
      repo : '',
      path : '/root/test/',
      'post-deploy' : 'npm install && npm run build'
    },
  }
};
