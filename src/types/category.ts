import { Document } from "mongoose";

interface IApplicableGrade {
    grade: string;
    description: string;
}

export interface ICategory extends Document {
    name: string;
    description: string;
    applicable_grades: IApplicableGrade[];
}
