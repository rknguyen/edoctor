require('dotenv').config();

import mongoose from 'mongoose';

mongoose.set('useCreateIndex', true);
mongoose
  .connect(`mongodb://localhost:27017/${process.env.DATABASE_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .catch(error => console.log(error));

export default mongoose;
