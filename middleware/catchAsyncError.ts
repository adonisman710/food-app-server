import { Request, Response, NextFunction } from 'express'

// A Reusable Function to working with async function and  avoid using trycatch block
export default (theFunc: any) => (req:Request, res:Response, next:NextFunction) => {
    Promise.resolve(theFunc(req, res, next)).catch(next);
  };