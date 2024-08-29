import { Response, Request } from "express";
import { ICategory } from "../types/category.js";
import Category from "../models/category.js";


const getAllCategories = async (req: Request, res: Response): Promise<any> => {
    try {
        const categories: ICategory[] = await Category.find();

        if (categories.length === 0) {
            res.status(404).json({ error: "no categories found!" });
            return;
        }
        res.status(200).json({ message: "These are all the categories you have", categories });
    } catch (error) {
        throw error;
    }
};

const getSingleCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const categoryId = req.params.id;
        const category: ICategory | null = await Category.findById(categoryId);

        if (!category) {
            res.status(404).json({ error: "a category with that id doesnt exist" });
            return;
        }
        res.status(200).json({ message: "this is the category you requested", category });
    } catch (error) {
        throw error;
    }
};

const createCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, description, applicable_grades } = req.body;

        const newCategory = new Category({
            name,
            description,
            applicable_grades
        });

        const savedCategory = await newCategory.save();

        res.status(201).json({ message: "Category created successfully", category: savedCategory });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateCategory = async (req: Request, res: Response): Promise<any> => {
    try {
        const categoryId = req.params.id;
        const { name, description, applicable_grades } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
                description,
                applicable_grades
            },
            { new: true }
        );

        if (!updatedCategory) {
            res.status(404).json({ error: "Category not found" });
            return;
        }

        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteCategory = async (req: Request, res: Response): Promise<any> => {
    try {

        const categoryId = req.params.id;

        const deletedCategory: ICategory | null = await Category.findOneAndDelete({ _id: categoryId });

        if (!deletedCategory) {
            res.status(404).json({ error: "a category with that id doesnt exist" });
            return;
        }

        res.status(200).json({ message: "this is the category you deleted", deletedCategory });

    } catch (error) {
        throw error;
    }
};


export { getAllCategories, getSingleCategory, createCategory, updateCategory, deleteCategory };