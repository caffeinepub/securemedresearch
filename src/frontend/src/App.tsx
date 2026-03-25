import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AITrainingPage from "./pages/AITrainingPage";
import HomePage from "./pages/HomePage";
import HospitalDashboard from "./pages/HospitalDashboard";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import ResultsPage from "./pages/ResultsPage";
import RoleSelectPage from "./pages/RoleSelectPage";

const rootRoute = createRootRoute();

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
});
const roleSelectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/role-select",
  component: RoleSelectPage,
});
const researcherRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/researcher",
  component: ResearcherDashboard,
});
const hospitalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/hospital",
  component: HospitalDashboard,
});
const patientRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/patient",
  component: PatientDashboard,
});
const trainingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/training",
  component: AITrainingPage,
});
const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/results",
  component: ResultsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  roleSelectRoute,
  researcherRoute,
  hospitalRoute,
  patientRoute,
  trainingRoute,
  resultsRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <Toaster position="top-right" />
      <RouterProvider router={router} />
    </>
  );
}
