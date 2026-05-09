module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'use-a-very-long-and-random-string-here'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'use-another-very-long-random-string-here'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'yet-another-very-long-random-string'),
    },
  },
  server: {
    url: env('PUBLIC_ADMIN_URL', '/admin'),
  },
});
