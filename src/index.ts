//TODO: build your application here
import express, { NextFunction, Request, Response, Router } from 'express';

const PORT = parseInt(process.env.PORT || '3000', 10);

const main = async (): Promise<void> => {
//TODO: start your application here
  const app = express();

  app.get('/', (req, res)=>{
    return res.send("Hello World!");
  })

  app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Listening on port ${PORT} `);
  });
}

main().catch(console.error);
