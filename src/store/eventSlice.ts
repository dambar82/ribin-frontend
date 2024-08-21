import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import {User} from "./userSlice";

export interface IEvent {
    id: number;
    name: string;
    description: string;
    caption: string | null;
    date: string;
    time: string;
    city: string | null;
    location: any;
    clients: User[];
}
