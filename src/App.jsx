import './App.css'
// import Header from './Components/Header/Header'
import Products from './Components/Products/Products'
export const config = {
  endpoint: `https://qkart-frontend-lfoa.onrender.com/api/v1`,
};
function App() {

  return (
    <>
      <Products/>
    </>
  )
}

export default App
