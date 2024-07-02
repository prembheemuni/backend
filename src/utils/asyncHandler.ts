import { NextFunction, Request, Response } from "express";

const asyncHandler =
  (requestHandler: any) =>
  async (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };

export { asyncHandler };

// ****Working****
// const controller = asyncHandler(async (req,res,next) => {})
// now inner function will be attched to controller, and at route.ts req,res,next wiil be passed to controller as params.
// then controller passes them to async function as above shown.
