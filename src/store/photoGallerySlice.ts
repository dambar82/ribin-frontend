import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { PhotoGallery } from "../types";

interface PhotoGalleryState {
    photoGallery: PhotoGallery[];
    photoGalleryData: PhotoGallery | null
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: PhotoGalleryState = {
    photoGallery: [],
    photoGalleryData: null,
    status: 'idle',
    error: null,
};

export const fetchPhotoGallery = createAsyncThunk('photoGallery/fetchPhotoGallery', async () => {
  console.log('fetchPhotoGallery');
  
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const photosUrl = `https://api-rubin.multfilm.tatar/api/request/photos`;

    const response = await axios.get(photosUrl);

    return response.data as PhotoGallery[];
});


export const fetchPhotoGalleryById = createAsyncThunk('photoGallery/fetchPhotoGalleryById', async (id: string) => {
    const photosUrl = `https://api-rubin.multfilm.tatar/api/request/photos/${id}`;

    const response = await axios.get(photosUrl);

    return response.data as PhotoGallery;
});


const photoGallerySlice = createSlice({
    name: 'photoGallery',
    initialState,
    reducers: {
      setStatus: ( state, data: PayloadAction<'idle'> ) => {
        state.status = data.payload
      }
    },
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
              console.log(action.payload);
              
                state.photoGalleryData = action.payload
            })
    }
})

export const { setStatus } = photoGallerySlice.actions;

export default photoGallerySlice.reducer;
