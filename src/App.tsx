// Sidebar component remains the same
import { useState } from 'react';
import { Box, CssBaseline } from '@mui/material';
import Header from './layout/Header';
import Sidebar from './layout/Sidebar';
import Footer from './layout/Footer';
import LoginComponent from './components/User/login';
function App() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentComponent, setCurrentComponent] = useState<React.ReactNode | null>(null);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Header isOpen={!isExpanded} onToggle={handleToggle} />
      <Sidebar isOpen={isExpanded} onClose={handleToggle} setCurrentComponent={setCurrentComponent} />
      <Box component="main" sx={{ flexGrow: 1, p: 12, marginLeft: isExpanded ? 10 : 0 }}>
        <div>
          {currentComponent === null ? (
            <LoginComponent setCurrentComponent={setCurrentComponent} />
          ) : (
            currentComponent
          )}
        </div>

      </Box>
      <Footer />
    </Box>
  );
}
export default App;
