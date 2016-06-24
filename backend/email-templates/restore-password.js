export default ({ code, config }) => {
  return {
    subject: 'Restore password',
    text: `Click this link to restore your password: ${config.url}change-password/${code}`
  };
};
