import './App.css'
// import Header from './Components/Header/Header'
import Products from './Components/Products/Products'
export const config = {
  //endpoint: `http://${ipConfig.workspaceIp}:8082/api/v1`,
  endpoint: `https://qkart-frontend-lfoa.onrender.com/api/v1`,
};
function App() {

  return (
    <>
      {/* <Header/> */}
      <Products/>
    </>
  )
}

export default App
