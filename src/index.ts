//TODO: build your application here
import express, { NextFunction, Request, Response, Router } from 'express';
import {FoodEntry, FoodEntryCreateOptions, FoodEntryDetails, FoodEntryUpdateOptions} from './interfaces';
import {randomUUID} from 'crypto';

const morgan = require('morgan');
const PORT = parseInt(process.env.PORT || '3000', 10);

const main = async (): Promise<void> => {
//TODO: start your application here
  const app = express();
  let foods : FoodEntry[] = [];

  app.use(express.json());

  app.use(morgan('combined'));

  app.get('/food', (req, res)=>{
    if(foods.length){
      return res.sendStatus(204);
    }
    return res.status(200).send(foods);
  })

  app.get('/food/:id', (req, res) =>{
    const foodId = req.params.id.toString();
    const foodExists = foods.find(food => food.id === foodId);
    if(foodExists===undefined){
      return res.status(404).send({error:"food not found"});
    }
    return res.status(200).send(foodExists);
  })

  app.post('/food', (req, res)=>{
    const newFoodEntry: FoodEntry ={
      id: randomUUID().toString(),
      createdAt: new Date(),
      name: req.body.name,
    };
    foods.push(newFoodEntry);
    return res.status(201).send(newFoodEntry);
  })

  app.put('/food/:id', (req, res)=>{
    const foodId = req.params.id.toString();
    const foodDetails = req.body;
    const foodIndex = foods.findIndex(food=>food.id === foodId);
    if(foodIndex === -1){
      return res.status(404).send('food not found');
    }
    foods[foodIndex].name = foodDetails.name.toString();
    return res.status(200).send(foods[foodIndex]);
  })

  app.delete('/food/:id', (req, res)=>{
    const foodId = req.params.id.toString();
    const foodIndex = foods.findIndex(food=> food.id === foodId);
    if(foodIndex !== -1){
      foods.splice(foodIndex, 1);
    }
    return res.sendStatus(204);
  })


  app.use('*',(req, res)=>{
    return res.status(404).send({error:'not found'});
  })

  app.use((err:unknown, req:Request, res:Response, _next: NextFunction)=>{
    return res.status(500).send({error:`internal server error`});
  })

  app.listen(PORT, '0.0.0.0', ()=>{
    console.log(`Listening on port ${PORT}...`);
  });

}

main().catch(console.error);
