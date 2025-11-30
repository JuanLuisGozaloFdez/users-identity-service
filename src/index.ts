import app from './app';

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`users-identity-service listening on port ${PORT}`);
});
