import Restaurant from "../../models/restaurant";
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";

export const createRestaurant = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Restaurant.create(req.body);
    res.status(201).json({
      success: true,
      data: restaurant,
    });
  }
);

export const getAllRestaurants = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const Restaurants = await Restaurant.find({}).populate("categories dishes");

    res.status(200).json({
      success: true,
      data: Restaurants,
    });
  }
);

export const getRestaurant = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Restaurant.findById(req.params.id).populate("categories dishes");
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    res.status(200).json({
      success: true,
      data: restaurant,
    });
  }
);

export const updateRestaurant = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    res.status(200).json({
      success: true,
      data: restaurant,
    });
  }
);

export const deleteRestaurant = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) {
      return next(new ErrorHandler("Restaurant not found", 404));
    }
    res.status(200).json({
      success: true,
      data: restaurant,
    });
  }
);
