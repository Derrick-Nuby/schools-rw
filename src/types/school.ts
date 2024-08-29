import { Document, Types } from "mongoose";

export interface ISchool extends Document {
    school_code: string;
    school_name: string;
    school_status: string;
    school_type: string;
    district_name: string;
    sector_name: string;
    cell_name: string;
    combination_ids: Types.ObjectId[];
}
