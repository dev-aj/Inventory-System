const express = require('express');
const path = require('path');

const app = express();

//Initialize BodyParser middleware
app.use(
  express.json({
    extended: false,
  })
);

app.get('/', (req, res) => {
  res.send('Home Route');
});

//Define routes
app.use('/api/stock/', require('./routes/stock'));
app.use('/api/user/', require('./routes/user'));
app.use('/api/order', require('./routes/orders'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
