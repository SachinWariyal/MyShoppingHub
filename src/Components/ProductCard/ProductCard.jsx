import PropTypes from 'prop-types';
import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import "./ProductCard.css";

const ProductCard = ({ product, handleAddToCart }) => {
  return (
    <Card className="card">
      <CardMedia component='img' alt ={product.name} image={product.image} />
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography>${product.cost}</Typography>
        <Rating value={product.rating} readOnly/>
      </CardContent>
      <CardActions>
        <Button
        className="card-button"
        variant="contained"
        fullWidth
        startIcon={<AddShoppingCartOutlined/>}
        onClick={handleAddToCart}
        >ADD TO CART</Button>

      </CardActions>
    </Card>
  );
};
ProductCard.propTypes = {
    product: PropTypes.shape({
      name: PropTypes.string.isRequired,
      image: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
    }).isRequired,
    handleAddToCart: PropTypes.func.isRequired,
  };
export default ProductCard;
