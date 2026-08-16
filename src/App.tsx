import { Routes, Route } from "react-router-dom";
import ProductsPage from "./pages/ProductsPage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Fitly</h1>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<ProductsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
