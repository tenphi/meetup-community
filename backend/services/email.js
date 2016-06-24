import Promise from 'bluebird';
import emailjs from 'emailjs';
import _ from 'lodash';
import Logger from '../logger.js';
import util from '../util';

let log = new Logger('email');

let EMAIL_REGEXP = /^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$/i;

export default {
  init({ config }) {
    this.emails = config.emails;
    this.connection = emailjs.server.connect(config.mail);
    this.templates = util.requireIntoObject('./email-templates');
    this.mailConfig = config.mail;
    this.config = config;
  },
  
  test(email) { 
    return EMAIL_REGEXP.test(email) 
  },
  
  send({ subject, text, from, to, cc, bcc, template, data = {} }) {
    let tmpData;
    
    Object.assign(data, { config: this.config });
    
    if (template) {
      tmpData = this.templates[template](data);
    }
    
    let mailData = {
      subject: tmpData.subject || subject,
      text: tmpData.text || text,
      from: from || this.mailConfig.outcomingName + ` <${this.emails.main}>`,
      to: to,
      cc: cc,
      bcc: bcc
    };

    return new Promise( (resolve, reject) => {
      this.connection.send(mailData, function(err, message) {
        if (err) {
          log.error('unable to send email', mailData);
          return reject(err);
        } else {
          log.info('email sent', mailData);
          return resolve(message);
        }
      });
    });
  },
  
  
};