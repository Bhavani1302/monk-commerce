import React from "react";
import ProductPicker from "./components/ProductPiker";
import './App.css'
import monkingImage from './components/image/monking.jpg';

function App() {
  return (
    <div>
            <header className="hader">
      <img src={monkingImage} alt="" />  Monk Upsell <span> &</span> Cross-sell
      </header>

    <div>
      <ProductPicker />
    </div>
    </div>  
  );
}

export default App;
