import { Box, Button } from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "./Header.css";
const Header = () => {
  return (
    <>
    <Box className="header">
        <Box className="header-title">
            <p>My Shopping Hub</p>  
        </Box>
        <Button className="explore-button"
                startIcon={<ArrowBackIcon />}
                variant="text"
                onClick ={()=>{
                  history.push('/')
                }}
              >
                Back to explore

        </Button>
    </Box>
    </>
  )
}

export default Header