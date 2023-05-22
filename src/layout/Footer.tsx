import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { Home, Favorite, LocationOn, Person } from '@mui/icons-material';
import React from 'react';

function Footer() {
  const [value, setValue] = React.useState('home');

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
    >
      <BottomNavigationAction label="Home" value="home" icon={<Home />} />
      <BottomNavigationAction label="Favorites" value="favorites" icon={<Favorite />} />
      <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOn />} />
      <BottomNavigationAction label="Profile" value="profile" icon={<Person />} />
    </BottomNavigation>
  );
}

export default Footer;
