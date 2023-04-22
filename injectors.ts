import { Handler, NextFunction, Request, Response } from "express";

const handlers: Handler[] = [
    async (req, res, next) => {

      // Inject 
      const { providerId } = req.params;
      if (providerId) {
        try {
          const provider = parseInt(providerId, 10);
          if (!provider) {
            return res.status(404).send(`Provider not found: ${providerId}`);
          }
          //req.provider = provider;
        } catch (e) {
          return res
            .status(500)
            .send(`Could not retrieve providers: ${providerId}`);
        }
      }
      else{
        return res
        .status(500)
        .send(`No providerId found: ${providerId}`);
      }

      if (next) next();
      return null;
    },

    //Duplicate of above handler, just using explicit types
    async (req: Request, res: Response, next: NextFunction) => {

      // Inject 
      const { providerId } = req.params;
      if (providerId) {
        try {
          const provider = parseInt(providerId, 10);
          if (!provider) {
            return res.status(404).send(`Provider not found: ${providerId}`);
          }
          //req.provider = provider;
        } catch (e) {
          return res
            .status(500)
            .send(`Could not retrieve providers: ${providerId}`);
        }
      }
      else{
        return res
        .status(500)
        .send(`No providerId found: ${providerId}`);
      }

      if (next) next();
      return null;
    },
  ];
  
  export default handlers;
  