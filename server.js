const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Errors in sync code
process.on('uncaughtException', (err) => {
  console.log('❌ Uncaught Exception, Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('✅ DB Connected Successfully'));

const port = process.env.PORT || 8000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

// Errors like 'failed to connect to DB'
process.on('unhandledRejection', (err) => {
  console.log('❌ Unhandled Rejection, Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
