import { Response, Request } from "express";
import { ISchool } from "../types/school.js";
import School from "../models/school.js";
import Combination from "../models/combination.js";
import dotenv from 'dotenv';
dotenv.config();

const responseNumber: number = Number(process.env.RES_NUMBER) || 16;


const getAllSchools = async (req: Request, res: Response): Promise<any> => {
    try {
        const page: number = Number(req.query.page) || 1;
        const limit: number = Number(req.query.limit) || responseNumber;

        if (limit >= 40) {
            res.status(400).json({ error: "that request is too large for our systems; please use below 20" });
            return;
        }

        const skip: number = (page - 1) * limit;

        const schools: ISchool[] = await School.find()
            .skip(skip)
            .limit(limit)
            .populate({
                path: 'combination_ids',
                model: Combination,
                select: '_id name abbreviation category_id description',
            });

        const totalSchools: number = await School.countDocuments();

        if (schools.length === 0) {
            return res.status(404).json({ error: "No schools found!" });
        }

        const totalPages: number = Math.ceil(totalSchools / limit);

        return res.status(200).json({
            message: "These are the schools you requested",
            currentPage: page,
            totalPages,
            totalSchools,
            schools,
        });
    } catch (error) {
        console.error("Error fetching schools:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const getSingleSchool = async (req: Request, res: Response): Promise<any> => {
    try {
        const schoolId = req.params.id;
        const school: ISchool | null = await School.findById(schoolId);

        if (!school) {
            res.status(404).json({ error: "a school with that id doesnt exist" });
            return;
        }
        res.status(200).json({ message: "this is the school you requested", school });
    } catch (error) {
        throw error;
    }
};

const createSchool = async (req: Request, res: Response): Promise<any> => {
    try {
        const { school_code, school_name, school_status, school_type, district_name, sector_name, cell_name, combination_ids } = req.body;

        const existingSchool = await School.findOne({ school_code });
        if (existingSchool) {
            return res.status(400).json({ error: "A School with that school code already exists, Please update that school instead of creating a new one!" });
        }

        const newSchool = new School({
            school_code,
            school_name,
            school_status,
            school_type,
            district_name,
            sector_name,
            cell_name,
            combination_ids
        });

        const savedSchool = await newSchool.save();

        res.status(201).json({ message: "School created successfully", school: savedSchool });
    } catch (error) {
        console.error("Error creating school:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const updateSchool = async (req: Request, res: Response): Promise<any> => {
    try {
        const schoolId = req.params.id;
        const { school_code, school_name, school_status, school_type, district_name, sector_name, cell_name, combination_ids } = req.body;


        const updatedSchool = await School.findByIdAndUpdate(
            schoolId,
            {
                school_code,
                school_name,
                school_status,
                school_type,
                district_name,
                sector_name,
                cell_name,
                combination_ids
            },
            { new: true }
        );

        if (!updatedSchool) {
            res.status(404).json({ error: "A school with that ID doesn't exist" });
            return;
        }

        res.status(200).json({ message: "School updated successfully", school: updatedSchool });
    } catch (error) {
        console.error("Error updating school:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const deleteSchool = async (req: Request, res: Response): Promise<any> => {
    try {

        const schoolId = req.params.id;

        const deletedSchool: ISchool | null = await School.findOneAndDelete({ _id: schoolId });

        if (!deletedSchool) {
            res.status(404).json({ error: "a school with that id doesnt exist" });
            return;
        }

        res.status(200).json({ message: "this is the school you deleted", deletedSchool });

    } catch (error) {
        throw error;
    }
};

const searchSchool = async (req: Request, res: Response): Promise<void> => {
    try {
        const searchQuery = req.query.query as string;
        const district = req.query.district as string;
        const school_status = req.query.school_status as string;
        const school_type = req.query.school_type as string;
        const sector_name = req.query.sector_name as string;
        const cell_name = req.query.cell_name as string;

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;

        if (!searchQuery || searchQuery.length < 2) {
            res.status(404).json({ error: "please increase the words you are searching for" });
            return;
        }

        const filter: any = {
            $text: { $search: searchQuery, $caseSensitive: false, $diacriticSensitive: false }
        };

        if (district) {
            filter.district_name = { $regex: new RegExp(district, 'i') };
        }
        if (school_status) {
            filter.school_status = { $regex: new RegExp(school_status, 'i') };
        }
        if (school_type) {
            filter.school_type = { $regex: new RegExp(school_type, 'i') };
        }
        if (sector_name) {
            filter.sector_name = { $regex: new RegExp(sector_name, 'i') };
        }
        if (cell_name) {
            filter.cell_name = { $regex: new RegExp(cell_name, 'i') };
        }

        const skip = (page - 1) * limit;

        const schools = await School.find(filter)
            .select({ score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .skip(skip)
            .limit(limit)
            .lean();



        const totalSchools = await School.countDocuments(filter);

        res.json({
            pagination: {
                totalSchools,
                currentPage: page,
                totalPages: Math.ceil(totalSchools / limit),
                resultsPerPage: limit,
            },
            schools,
        });
    } catch (error) {
        console.error("Error searching for schools:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



export { getAllSchools, getSingleSchool, createSchool, updateSchool, deleteSchool, searchSchool };