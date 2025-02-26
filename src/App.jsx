import { createBrowserRouter, RouterProvider } from "react-router-dom"
import SignUp from "./pages/SignUp/SignUp"
import SignIn from "./pages/SignIn/SignIn"

const routes = createBrowserRouter([
  { path: '/', element: <SignUp/>, errorElement: <h1>Page not found.</h1>},
  { path: '/signin', element: <SignIn/>}
])

function App() {
  return (
    <RouterProvider router={routes}/>
  )
}

export default App
