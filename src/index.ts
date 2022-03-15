//TODO: build your application here
import express, { NextFunction, Request, Response, Router } from 'express';
import {FoodEntry, FoodEntryCreateOptions, FoodEntryDetails, FoodEntryUpdateOptions} from './interfaces';
import {randomUUID, randomBytes} from 'crypto';

const jwt = require('jsonwebtoken');
const morgan = require('morgan');
const PORT = parseInt(process.env.PORT || '3000', 10);
const privateKey = process.env.PRIVATE_KEY || randomBytes(64).toString();

const main = async (): Promise<void> => {
//TODO: start your application here
  const app = express();
  const foodRouter = Router();
  let foods : FoodEntry[] = [];

  app.use(express.json());
  app.use(morgan('combined'));
  app.disable('x-powered-by');

  foodRouter.get('', (req, res)=>{
    if(!foods.length){
      return res.sendStatus(204);
    }
    return res.status(200).send(foods);
  })

  foodRouter.get('/:id', (req, res) =>{
    const foodId = req.params.id.toString();
    const foodExists = foods.find(food => food.id === foodId);
    if(foodExists===undefined){
      return res.status(404).send({error:"food not found"});
    }
    return res.status(200).send(foodExists);
  })

  foodRouter.post('', (req, res)=>{
    const newFoodEntry: FoodEntry ={
      id: randomUUID().toString(),
      createdAt: new Date(),
      name: req.body.name,
    };
    foods.push(newFoodEntry);
    return res.status(201).send(newFoodEntry);
  })

  foodRouter.put('/:id', (req, res)=>{
    const foodId = req.params.id.toString();
    const foodDetails = req.body;
    const foodIndex = foods.findIndex(food=>food.id === foodId);
    if(foodIndex === -1){
      return res.status(404).send('food not found');
    }
    foods[foodIndex].name = foodDetails.name.toString();
    return res.status(200).send(foods[foodIndex]);
  })

  foodRouter.delete('/:id', (req, res)=>{
    const foodId = req.params.id.toString();
    const foodIndex = foods.findIndex(food=> food.id === foodId);
    if(foodIndex !== -1){
      foods.splice(foodIndex, 1);
    }
    return res.sendStatus(204);
  })

  app.post('/login', (req, res)=>{
    // const validUsername: string = process.env.VALID_USERNAME;
    // const validPassword: string = process.env.VALID_PASSWORD;
    const validUsername: string = "Ben";
    const validPassword: string = "admin";
    const { username, password } = req.body;

    if(username===validUsername && password===validPassword){
      const signedToken = jwt.sign({user:username}, privateKey);

      return res.status(200).send({token:signedToken});
    }
    return res.status(401).send({error:"invalid login credentials"});
  })

  app.use('/food', authenticateToken, foodRouter);

  app.use('*',(req, res)=>{
    return res.status(404).send({error:'not found'});
  })

  app.use((err:unknown, req:Request, res:Response, _next: NextFunction)=>{
    return res.status(500).send({error:`internal server error`});
  })

  app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Listening on port ${PORT}...`);
  });


  function authenticateToken(req:Request, res:Response, next:NextFunction){
    const { authorization: authHeader } = req.headers;
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
      return res.sendStatus(401);
    }
    jwt.verify(token, privateKey, (err:Error)=>{
      if(err){
        return res.sendStatus(401);
      }
    next();
    });
  }

}

main().catch(console.error);
