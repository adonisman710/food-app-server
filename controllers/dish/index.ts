import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../../middleware/catchAsyncError";
import Dish from '../../models/dish'
import ErrorHandler from "../../utils/errorHandler";

export const createDish = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const resultant = await Dish.create(req.body);
    res.status(201).json({
        success: true,
        data: resultant
    });
})

export const updateDish = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const resultant = await Dish.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    if (!resultant) {
        return next(new ErrorHandler("Resultant not found", 404));
    }
    res.status(200).json({
        success: true,
        data: resultant
    });
})

export const deleteDish = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const resultant = await Dish.findByIdAndDelete(req.params.id);
    if (!resultant) {
        return next(new ErrorHandler("Resultant not found", 404));
    }
    res.status(200).json({
        success: true,
        data: resultant
    });
})