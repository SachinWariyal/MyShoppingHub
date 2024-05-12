import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { config } from "../../App.jsx";
// import Footer from "./Footer";
import Header from "../Header/Header.jsx";
import ProductCard from "../ProductCard/ProductCard.jsx";
import Cart, { generateCartItemsFrom } from "../Cart/Cart.jsx";
import "./Products.css";

const Products = () => {
  const [items,setItems] = useState([])
  const { enqueueSnackbar } = useSnackbar();
  const[products,setProducts]=useState([])
  const [loading,setLoading]=useState(true)
  const [searchText,setSearchText]=useState('')
  const [debounceTimeout,SetDebounceTimeout]=useState(null)
  const token = localStorage.getItem('token')

  useEffect(()=>{
    (async()=>{
      let data = await performAPICall()
      setProducts(data)
      setLoading(false)
    })()
  },[])

  const performAPICall = async () => {
    try{
      let res = await axios.get(`${config.endpoint}/products`)
      return res.data
    }catch(e){
        console.error("Error occurred while fetching products:", e);
        throw e;
    }
  };

  const performSearch = async (text) => {
    // setSearchText(text);
    try{
      let res = await axios.get(`${config.endpoint}/products/search?value=${text}`)
      setProducts(res.data)
    }catch(e){
      if(e.response && e.response.status === 404){
        setProducts([])
      }
    }
  };
  const debounceSearch = (event, debounceTimeout) => {
    clearTimeout(debounceTimeout)
    let timerId = setTimeout(() =>{
      performSearch(event.target.value)
    }, 1000)
    SetDebounceTimeout(timerId);
    setSearchText(event.target.value)
  };

    useEffect(()=>{
      const onLoadHandler = async () =>{
        const productsData = await performAPICall();
        const cartData = await fetchCart(token);
        updateCartItems(cartData,productsData)
        const cartDetails = generateCartItemsFrom(cartData,productsData);
        setItems(cartDetails)
      }
      onLoadHandler();
    },[]);

  const fetchCart = async (token) => {
    if (!token) return;

    try {
      const response = await axios.get(`${config.endpoint}/cart`,
        {
          headers: {
          'Authorization': `Bearer ${token}`,
          }
        }
      );
      console.log(response.data)
      return response.data;
    }
      
     catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not add item to the cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };

  const isItemInCart = (items, productId) => {
    return !!items.find((item)=> item.productId === productId);
  };
  const updateCartItems = (cartData, products)=>{
    const cartItems = generateCartItemsFrom(cartData,products);
    setItems(cartItems);
  }

  const addToCart = async (
    token,
    items,
    products,
    productId,
    qty,
    options = { preventDuplicate: false }
  ) => {
    if (!token){
      enqueueSnackbar("Login to add an item to the Cart", { variant: "error" });
      return;
    } 

    try {
      if(options.preventDuplicate){
        if(isItemInCart(items,productId)){
          enqueueSnackbar("Item already in cart. Use the cart sidebar to update quantity or remove item.", { variant: "error" });
          return;
        }
      }
      const response = await axios.post(`${config.endpoint}/cart`,
        {
          productId,
          qty
        },
        {
          headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type' : 'application/json' 
          }
        }
      )
      console.log(response.data)
      updateCartItems(response.data, products)
      // return response.data;
    }
      
     catch (e) {
      if (e.response && e.response.status === 400) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
      } else {
        enqueueSnackbar(
          "Could not fetch cart details. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
      return null;
    }
  };


  return (
    <div>
      <Header>
        <TextField
        className="search-desktop"
        size="small"
        // fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchText}
        onChange={(e)=>{
          debounceSearch(e,debounceTimeout)
          
        }}
      />
      </Header>

      {/* Search view for mobiles */}
      <TextField
        className="search-mobile"
        size="small"
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Search color="primary" />
            </InputAdornment>
          ),
        }}
        placeholder="Search for items/categories"
        name="search"
        value={searchText}
        onChange={(e)=>{
          debounceSearch(e,debounceTimeout)
          
        }}
      />
       <Grid container>
         <Grid
            item
            xs={12} md={token && products.length?9:12}
            className="product-grid">
            <Box className="hero">
              <p className="hero-heading">
                The Best<span className="hero-highlight">SHOPPING HUB</span>{" "}
                in your Town
              </p>
            </Box>
         
       
            {loading ? <Box className='loading'>
              <CircularProgress/>
              <h4>Loading Products...</h4>
              </Box> : (products.length? <Grid container spacing={2} paddingX='12px' marginY='8px'>
            {products.map(product=><Grid item xs={6} md={3} key={product.id}>
                  <ProductCard
                  product={product}
                  handleAddToCart={async () =>{
                    await addToCart(
                      token,
                      items,
                      products,
                      product._id,
                      1,
                      { preventDuplicate: true }
                    )
                  }}
                  />
                </Grid > )}
            </Grid> : <Box className='loading'>
                <SentimentDissatisfied/>
                <h4>No Products Found...</h4>
                </Box>
              ) 
            }
          </Grid>
          {token ? (
            <Grid item xs={12} md={3} bgcolor="#E9F5E1">
              <Cart
                hasCheckoutButton
                products={products}
                items={items}
                handleQuantity={addToCart}
                token={token}
              />
            </Grid>
          ):null}
        </Grid>
      {/* <Footer /> */}
    </div>
  );
};

export default Products;
