import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from "../types/category";

const ApplicableGradeSchema: Schema = new Schema({
    grade: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
});

const CategorySchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    applicable_grades: {
        type: [ApplicableGradeSchema],
        required: true
    },
});

export default mongoose.model<ICategory>('Category', CategorySchema);
