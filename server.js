const app = require('./app');
const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});