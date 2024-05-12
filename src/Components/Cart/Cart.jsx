import PropTypes from 'prop-types';
import {
    AddOutlined,
    RemoveOutlined,
    ShoppingCart,
    ShoppingCartOutlined,
  } from "@mui/icons-material";
  import { Button, IconButton, Stack } from "@mui/material";
  import { Box } from "@mui/system";
//   import { useHistory } from "react-router-dom";
  // import { Link } from 'react-router-dom';
  import "./Cart.css";
 
  export const generateCartItemsFrom = (cartData, productsData) => {
  
      if(!cartData) return;
  
      const nextCart = cartData.map((item)=>{
        return{
          ...item,
          ...productsData.find((product) => item.productId === product._id),
        }
      })
      return nextCart
  };
  
  /**
   * Get the total value of all products added to the cart
   */
  export const getTotalCartValue = (items = []) => {
    if(!items.length) return 0;
    const total = items.reduce((total,current)=>total+(current.cost * current.qty), 0);
    return total;
  };
  
  export const getTotalItems = (items = []) => {
    if(!items.length) return 0;
    const total = items.reduce((total,current)=>total+(current.qty), 0);
    return total;
  };
  const ItemQuantity = ({
    value,
    handleAdd,
    handleDelete,
    isReadOnly
  }) => {
    if(isReadOnly){
      return <Box>Qty:{value}</Box>
    }
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  };
  const Cart = ({
    products,
    items = [],
    handleQuantity,
    hasCheckoutButton=false,
    isReadOnly=false,
  }) => {
    const token = localStorage.getItem('token');
    // const history=useHistory();
  
    const routeToCheckout =()=>{
      history.push('/checkout')
    }
  
  
    if (!items.length) {
      return (
        <Box className="cart empty">
          <ShoppingCartOutlined className="empty-cart-icon" />
          <Box color="#aaa" textAlign="center">
            Cart is empty. Add more items to the cart to checkout.
          </Box>
        </Box>
      );
    }
  
    return (
      <>
        <Box className="cart">
            {items.map((item)=>(
              <Box key={items.productId}>
                {item.qty>0 ? (
                  <Box display="flex" alignItems="flex-start" padding="1rem">
                    <Box className="image-container">
                        <img
                            // Add product image
                            src={item.image}
                            // Add product name as alt eext
                            alt={item.name}
                            width="100%"
                            height="100%"
                        />
                    </Box>
                    <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="space-between"
                            height="6rem"
                            paddingX="1rem"
                        >
                            <div>{item.name}</div>
                            <Box
                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                            >
                            <ItemQuantity
                            // Add required props by checking implementation
                              handleAdd={async () =>{
                                await handleQuantity(
                                  token,
                                  items,
                                  products,
                                  item.productId,
                                  item.qty+1,
                                  
                                )
                              }}
                              handleDelete={async () =>{
                                await handleQuantity(
                                  token,
                                  items,
                                  products,
                                  item.productId,
                                  item.qty-1,
                                  
                                )
                              }}
                              value={item.qty}
                              isReadOnly={isReadOnly}
                            />
                              <Box padding="0.5rem" fontWeight="700">
                                  ${item.cost}
                              </Box>
                            </Box>
                    </Box> 
                  </Box>
                ):null}
              </Box>
            ))}
  
          <Box
            padding="1rem"
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box color="#3C3C3C" alignSelf="center">
              Order total
            </Box>
            <Box
              color="#3C3C3C"
              fontWeight="700"
              fontSize="1.5rem"
              alignSelf="center"
              data-testid="cart-total"
            >
              ${getTotalCartValue(items)}
            </Box>
          </Box>
  
          {hasCheckoutButton && <Box display="flex" justifyContent="flex-end" className="cart-footer">
            {/* <Link to="/checkout"> */}
              <Button
                color="primary"
                variant="contained"
                startIcon={<ShoppingCart />}
                className="checkout-btn"
                onClick={routeToCheckout}
              >
                Checkout
              </Button>
            {/* </Link> */}
          </Box>}
        </Box>
        {isReadOnly && <Box className="cart" padding="1rem">
           <h2>Order Details</h2>
           <Box className="cart-row">
            <p>Products</p>
            <p>{getTotalItems(items)}</p>
            </Box>                    
           <Box className="cart-row">
            <p>Subtotal</p>
            <p>${getTotalCartValue(items)}</p>
            </Box>                    
           <Box className="cart-row">
            <p>Shipping Charge</p>
            <p>$0</p>
            </Box> 
            <Box className="cart-row" font-size="1.25" fontWeight="700">
              <p>Total</p>
              <p>${getTotalCartValue(items)}</p>
              </Box>                   
        </Box>}
      </>
    );
  };
  Cart.propTypes = {
    products: PropTypes.arrayOf(PropTypes.object).isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      qty: PropTypes.number.isRequired,
      category: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      productId: PropTypes.string.isRequired,
    })),
    handleQuantity: PropTypes.func.isRequired,
    hasCheckoutButton: PropTypes.bool,
    isReadOnly: PropTypes.bool,
  };
  ItemQuantity.propTypes = {
    value: PropTypes.number.isRequired,
    handleAdd: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
    isReadOnly: PropTypes.bool,
  };
  export default Cart;
  