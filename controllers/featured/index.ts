import { NextFunction, Request, Response } from "express";
import catchAsyncError from "../../middleware/catchAsyncError";
import Featured from '../../models/featured'
import ErrorHandler from "../../utils/errorHandler";

export const createFeatured = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Featured.create(req.body);
    res.status(201).json({
        success: true,
        data: restaurant
    });
});

export const getSingleFeatured = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const featured = await Featured.findById(req.params.id);
    if (!featured) {
        return next(new ErrorHandler('Restaurant not found', 404));
    }
    res.status(200).json({
        success: true,
        data: featured
    });
});

export const getAllFeatured = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const featured = await Featured.find({}).populate({
        path: "restaurants",
        populate:[{
            path: "categories",
            model: "Categories"
        }, {
            path: "dishes",
            model: "Dish"
         }]
    });
    res.status(200).json({
        success: true,
        data: featured
    });
})

export const updateFeatured = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Featured.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    if (!restaurant) {
        return next(new ErrorHandler("Resultant not found", 404));
    }
    res.status(200).json({
        success: true,
        data: restaurant
    });
})

export const deleteFeatured = catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Featured.findByIdAndDelete(req.params.id);
    if (!restaurant) {
        return next(new ErrorHandler("Restaurant not found", 404));
    }
    res.status(200).json({
        success: true,
        data: restaurant
    });
})