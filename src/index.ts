//TODO: build your application here
import express, { NextFunction, Request, Response } from 'express';
import 'dotenv/config';
import { foodRouter } from './foodrouter';
import { authenticateToken, signToken } from './utils';
import morgan = require('morgan');

const PORT = parseInt(process.env.PORT || '3000', 10);
const app = express();

app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan('combined'));
app.disable('x-powered-by');

app.use('/food', authenticateToken, foodRouter);

app.post('/login', (req: Request, res: Response) => {
  const validUsername = process.env.VALID_USERNAME;
  const validPassword = process.env.VALID_PASSWORD;
  const { username, password } = req.body as { username: string; password: string };
  const areValidCredentials = username === validUsername && password === validPassword;

  if (areValidCredentials) {
    const signedToken = signToken(username);
    return res.status(200).send({ token: signedToken });
  }
  return res.status(401).send({ error: 'invalid login credentials' });
});

app.use('*', (req, res) => {
  return res.status(404).send({ error: 'not found' });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  return res.status(500).send({ error: `internal server error` });
});

const main = async (): Promise<void> => {
  //TODO: start your application here

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Listening on port ${PORT}...`);
  });
};

main().catch(console.error);
