import { Response, Request } from "express";
import { ICombination } from "../types/combination.js";
import Combination from "../models/combination.js";
import category from "../models/category.js";


const getAllCombinations = async (req: Request, res: Response): Promise<any> => {
    try {
        const combinations: ICombination[] = await Combination.find()
            .populate({
                path: 'category_id',
                model: category,
                select: '_id name description applicable_grades',
            });;

        if (combinations.length === 0) {
            res.status(404).json({ error: "no combinations found!" });
            return;
        }
        res.status(200).json({ message: "These are all the combinations you have", combinations });
    } catch (error) {
        throw error;
    }
};

const getSingleCombination = async (req: Request, res: Response): Promise<any> => {
    try {
        const combinationId = req.params.id;
        const combination: ICombination | null = await Combination.findById(combinationId);

        if (!combination) {
            res.status(404).json({ error: "a combination with that id doesnt exist" });
            return;
        }
        res.status(200).json({ message: "this is the combination you requested", combination });
    } catch (error) {
        throw error;
    }
};

const createCombination = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, abbreviation, category_id, description } = req.body;

        const newCombination = new Combination({
            name,
            abbreviation,
            category_id,
            description,
        });

        const savedCombination = await newCombination.save();

        res.status(201).json({ message: "Combination created successfully", combination: savedCombination });
    } catch (error) {
        console.error("Error creating combination:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateCombination = async (req: Request, res: Response): Promise<any> => {
    try {
        const combinationId = req.params.id;
        const { name, abbreviation, category_id, description } = req.body;

        const updatedCombination = await Combination.findByIdAndUpdate(
            combinationId,
            {
                name,
                abbreviation,
                category_id,
                description,
            },
            { new: true }
        );

        if (!updatedCombination) {
            res.status(404).json({ error: "A combination with that ID doesn't exist" });
            return;
        }

        res.status(200).json({ message: "Combination updated successfully", combination: updatedCombination });
    } catch (error) {
        console.error("Error updating combination:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteCombination = async (req: Request, res: Response): Promise<any> => {
    try {

        const combinationId = req.params.id;

        const deletedCombination: ICombination | null = await Combination.findOneAndDelete({ _id: combinationId });

        if (!deletedCombination) {
            res.status(404).json({ error: "a combination with that id doesnt exist" });
            return;
        }

        res.status(200).json({ message: "this is the combination you deleted", deletedCombination });

    } catch (error) {
        throw error;
    }
};


export { getAllCombinations, getSingleCombination, createCombination, updateCombination, deleteCombination };