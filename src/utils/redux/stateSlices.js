import { createSlice } from "@reduxjs/toolkit";
import { Moods } from "../moods";

export const moodSetterSlice = createSlice({
    name:"moodSetter",
    initialState:{
        isSearching: false,
        moodName: Moods.happy,
    },
    reducers: {
        selectIsSearching: state => state.isSearching,
        selectMoodName: state => state.moodName,
    }
})

export const playerSlice = createSlice({
    name: "player",
    initialState:{
        currentTrack: null,
        currentTrackIndex: 0,
    },
    reducers:{
        setCurrentTrack: (state, action) => {state.currentTrack = action.payload },
        setCurrentTrackIndex: (state, action) => {state.currentTrackIndex = action.payload}
    }
})

export const {selectIsSearching, selectMoodName} = moodSetterSlice.action;
export const {setCurrentTrack, setCurrentTrackIndex} = playerSlice.actions;