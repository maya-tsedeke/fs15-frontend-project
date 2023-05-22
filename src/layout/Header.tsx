import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Menu, Home, Favorite, LocationOn, Person } from "@mui/icons-material";

interface HeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

function Header(props: HeaderProps) {
  const { isOpen, onToggle } = props;

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton color="inherit" onClick={onToggle}>
          <Menu />
        </IconButton>
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          {isOpen ? "fs15_frontend-project" : "Menu"}
        </Typography>
        
          <>
            <IconButton color="inherit">
              <Home />
            </IconButton>
            <IconButton color="inherit">
              <Favorite />
            </IconButton>
            <IconButton color="inherit">
              <LocationOn />
            </IconButton>
            <IconButton color="inherit">
              <Person />
            </IconButton>
          </>
       
      </Toolbar>
    </AppBar>
  );
}

export default Header;
