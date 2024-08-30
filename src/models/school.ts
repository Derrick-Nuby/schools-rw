import mongoose, { Schema } from 'mongoose';
import { ISchool } from "../types/school";

const SchoolSchema: Schema = new Schema({
    school_code: {
        type: String,
        required: true,
        match: /^[0-9]{6}$/,
    },
    school_name: {
        type: String,
        required: true,
        minlength: 3,
        match: /^[a-zA-Z0-9 ]+$/,
    },
    school_status: {
        type: String,
        enum: ['PUBLIC', 'PRIVATE', 'GOVERNMENT_AIDED'],
        required: true,
    },
    school_type: {
        type: String,
        enum: ['DAY', 'BOARDING', 'DAY & BOARDING'],
        required: true,
    },
    district_name: {
        type: String,
        required: true,
        minlength: 3,
        match: /^[a-zA-Z ]+$/,
    },
    sector_name: {
        type: String,
        required: true,
        minlength: 3,
        match: /^[a-zA-Z ]+$/,
    },
    cell_name: {
        type: String,
        required: true,
        minlength: 3,
        match: /^[a-zA-Z ]+$/,
    },
    combination_ids: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Combination',
        required: true,
    }],
});

SchoolSchema.index({ school_name: 'text', district_name: 'text' });

export default mongoose.model<ISchool>('School', SchoolSchema);
