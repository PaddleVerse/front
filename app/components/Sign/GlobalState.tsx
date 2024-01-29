'use client';
import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Define the state type
interface GlobalState {
  // Your global state properties go here
  exampleProperty: string;
}

// Define action types
type Action =
  | { type: 'UPDATE_PROPERTY'; payload: string };

// Define initial state
const initialState: GlobalState = {
  exampleProperty: 'Initial Value',
};

// Create context
const GlobalStateContext = createContext<{ state: GlobalState; dispatch: Dispatch<Action> } | undefined>(undefined);

// Define the reducer function
const globalReducer = (state: GlobalState, action: Action): GlobalState => {
  switch (action.type) {
    case 'UPDATE_PROPERTY':
      return { ...state, exampleProperty: action.payload };
    default:
      return state;
  }
};

// Create the provider
export const GlobalStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
};

// Create a custom hook to use the global state
export const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
};
