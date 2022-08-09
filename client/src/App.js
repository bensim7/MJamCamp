import "./App.css";
import NavBar from "./components/NavBar";
import { Route, Navigate, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <header>
        <h1>hello</h1>
      </header>
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Navigate replace to="/Login" />} />
          {/* <Route path="/Login" element={<Login />} />
          <Route path="/Writesong" element={<Writesong />} />
          <Route path="Searchsong" element={<Searchsong />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default App;
