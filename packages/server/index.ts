import dotenv from 'dotenv';
import express from 'express';
import router from './routes';
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api', router);
// const port = process.env.PORT || 3000;
// if (process.env.NODE_ENV !== 'production') {
//   app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//   });
// }

export default app;
