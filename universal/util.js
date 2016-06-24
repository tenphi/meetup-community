import owasp from 'owasp-password-strength-test';

owasp.config({
  allowPassphrases       : true,
  maxLength              : 128,
  minLength              : 10,
  minPhraseLength        : 20,
  minOptionalTestsToPass : 2,
});

export default {
  testPasswordStrength(password) {
    return owasp.test(password);
  }
};
