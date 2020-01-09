import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Selector } from 'react-redux';
import { RootState } from './';

export const tutorialSelector: Selector<RootState, Tutorial> = state => state.tutorial;
export interface Tutorial {
  emphasizeButton: ButtonPositions;
}

export enum ButtonPositions {
  Left,
  Middle,
  Right,
}

const initialState: Tutorial = {
  emphasizeButton: null,
};

const tags = createSlice({
  name: 'tutorial',
  initialState,
  reducers: {
    emphasizeButton(state, action: PayloadAction<ButtonPositions>) {
      state.emphasizeButton = action.payload;
    },
  }
});

export const {
  emphasizeButton,
} = tags.actions;

export default tags.reducer;
