export default ({ code, config }) => {
  return {
    subject: 'Confirmation',
    text: `Click this link to confirm your email: ${config.url}api/auth/confirmation/${code}`
  };
};
