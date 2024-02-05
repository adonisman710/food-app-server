import Categories from "../../models/categories";
import { Request, Response, NextFunction } from "express";
import catchAsyncError from "../../middleware/catchAsyncError";
import ErrorHandler from "../../utils/errorHandler";

export const createCategory = catchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const category = await Categories.create(req.body);
    
    res.status(201).json({
        success: true,
        category
    })
})

export const getAllCategories = catchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const categories = await Categories.find();
    res.status(200).json({
        success: true,
        categories
    })
})

export const getSingleCategory = catchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const category = await Categories.findById(req.params.id);
    if(!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    res.status(200).json({
        success: true,
        category
    })
})

export const updateCategory = catchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    let category = await Categories.findById(req.params.id);
    if(!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    category = await Categories.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });
    res.status(200).json({
        success: true,
        category
    })
})

export const deleteCategory = catchAsyncError(async(req:Request, res:Response, next:NextFunction) => {
    const category = await Categories.findById(req.params.id);
    if(!category) {
        return next(new ErrorHandler("Category not found", 404));
    }
    await category.remove();
    res.status(200).json({
        success: true,
        message: "Category deleted"
    })
})