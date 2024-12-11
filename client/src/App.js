import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Footer, Header } from "./components";
import { Home, Login, Register } from "./pages";
import { UserContextProvider } from "./contexts/UserContext";

const Layout = () => (
  <>
    <Header />
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
};

export default App;
