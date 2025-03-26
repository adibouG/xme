// Basic Express API setup with TypeScript
import express from 'express';
import { jobSourceRouter } from './routes/jobSource';
import { errorHandler } from './middleware/errorHandler';

const app = express();
//express.
app.use(express.json());
app.use('/api/jobs', jobSourceRouter);
app.use(errorHandler);

export default app;