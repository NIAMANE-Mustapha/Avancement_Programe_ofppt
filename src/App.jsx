import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import FormateursRendement from "./Pages/FormateursRendement";
import ImportData from "./Pages/ImportData";
import AffectationModule from "./Pages/AffectationModule";
import Header from "./components/Header";
import AvancementFormateur from "./Pages/AvancementFormateur";
import AvancementSone from "./Pages/AvancementSone";
import AvencementParGroup from "./Pages/AvencementParGroup";
import AvencementParModule from "./Pages/AvencementParModule";
import NombreEfmParGroup from "./Pages/NombreEfmParGroup";
import Login from "./Pages/Login";
import ProtectedRoutes from "./components/ProtectedRoutes";


function App() {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<Layout />}>
                <Route path="/" element={<Header />}>
                    <Route index element={<Login/>} />
                    <Route  element={<ProtectedRoutes/>}>
                        <Route path="importData" element={<ImportData />} />
                        <Route
                            path="FormateursRendementController"
                            element={<FormateursRendement />}
                        />
                        <Route
                            path="AffectationController"
                            element={<AffectationModule />}
                        />
                        <Route
                            path="AvencementParGroup"
                            element={<AvencementParGroup />}
                        />
                        <Route
                            path="avancementFormateur"
                            element={<AvancementFormateur />}
                        />
                        <Route
                            path="AvencementParModule"
                            element={<AvencementParModule />}
                        />
                        <Route
                            path="NombreEfmParGroup"
                            element={<NombreEfmParGroup />}
                        />
                        <Route path="avancementSone" element={<AvancementSone />} />
                        <Route path="*" element={<ImportData />} />
                    </Route>
                    
                </Route>
            </Route>
        )
    );
    return (

            <RouterProvider router={router} />

    );
}

export default App;
