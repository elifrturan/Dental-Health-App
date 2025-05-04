import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SignUp from "./pages/SignUp/SignUp"
import SignIn from "./pages/SignIn/SignIn"
import CheckEmail from "./pages/ForgotPassword/CheckEmail/CheckEmail"
import ResetPassword from "./pages/ForgotPassword/ResetPassword/ResetPassword"
import Home from "./pages/Home/Home"
import Profile from "./pages/Profile/Profile"
import HealthPage from "./pages/HealthPage/HealthPage"

const routes = createBrowserRouter([
  { path: '/', element: <SignUp/>, errorElement: <h1>Page not found.</h1>},
  { path: '/signup', element: <SignUp/>},
  { path: '/signin', element: <SignIn/>},
  { path: '/forgotpassword', element: <CheckEmail/>},
  { path: '/reset-password', element: <ResetPassword/>},
  { path: '/home', element: <Home/>},
  { path: '/profile', element: <Profile/>},
  { path: '/health-page', element: <HealthPage/>}
])

function App() {
  return (
    <RouterProvider router={routes}/>
  )
}

export default App
