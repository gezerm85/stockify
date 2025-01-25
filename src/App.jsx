/* eslint-disable no-unused-vars */
import React from 'react';
import AppRouter from './Router/AppRouter'; 
import {auth, db} from './firebase'

function App() {
  return (
    <div>
      <AppRouter />
    </div>
  );
}

export default App;
