import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { PhotoGallery } from "../types";

interface PhotoGalleryState {
    photoGallery: PhotoGallery[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PhotoGalleryState = {
    photoGallery: [],
    status: 'idle',
    error: null,
};

export const fetchPhotoGallery = createAsyncThunk('photoGallery/fetchPhotoGallery', async () => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const photosUrl = `https://api-rubin.multfilm.tatar/api/request/photos`;

    const response = await axios.get(photosUrl, {
        headers: {
            'Origin': 'http://localhost:3000'
        }
    });

    return response.data as PhotoGallery[];
});


export const fetchPhotoGalleryById = createAsyncThunk('photoGallery/fetchPhotoGalleryById', async (id: string) => {
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const photosUrl = `${proxyUrl}https://loyalfans.rubin-kazan.ru/api/v1/bitrix/photos/${id}`;

    const response = await axios.get(photosUrl, {
        headers: {
            'Origin': 'http://localhost:3000'
        }
    });

    return response.data as PhotoGallery;
});


const photoGallerySlice = createSlice({
    name: 'photoGallery',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPhotoGallery.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPhotoGallery.fulfilled, (state, action: PayloadAction<PhotoGallery[]>) => {
                state.photoGallery = action.payload;
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(fetchPhotoGallery.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            })
            .addCase(fetchPhotoGalleryById.fulfilled, (state, action: PayloadAction<PhotoGallery>) => {
                state.photoGallery.map(gallery => {
                    if (gallery.id === action.payload.id) {
                        gallery.photos = action.payload.photos;
                    }
                })
                state.status = 'succeeded';
            })
    }
})


export default photoGallerySlice.reducer;
