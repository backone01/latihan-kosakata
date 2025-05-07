import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Tooltip
} from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FlipToFrontIcon from '@mui/icons-material/FlipToFront';
import QuizIcon from '@mui/icons-material/Quiz';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';

// Navigation items
const navItems = [
  { text: 'Daftar', path: '/', icon: <MenuBookIcon />, tooltip: 'Daftar Kosakata' },
  { text: 'Kartu', path: '/flipcard', icon: <FlipToFrontIcon />, tooltip: 'Kartu Flash' },
  { text: 'Kuis', path: '/quiz', icon: <QuizIcon />, tooltip: 'Latihan Kuis' },
  { text: 'Kelola', path: '/vocab', icon: <SettingsIcon />, tooltip: 'Kelola Kosakata' },
];

export default function Navbar() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isXsScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" sx={{ 
      mb: { xs: 2, sm: 4 }, 
      boxShadow: 3,
      '& .MuiToolbar-root': {
        minHeight: { xs: 56, sm: 64 },
        padding: { xs: '0 8px', sm: '0 16px' }
      }
    }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: { xs: 1, sm: 2 },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              '&:hover': {
                opacity: 0.9,
              },
            }}
          >
            {isXsScreen ? '📚' : '📚 Latihan Kosakata'}
          </Typography>

          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            ml: { xs: 0, sm: 2, md: 3 }, 
            gap: { xs: 0, sm: 1 },
            justifyContent: { xs: 'space-around', sm: 'flex-start' },
            maxWidth: { xs: '100%', sm: 'auto' },
            overflowX: 'auto',
            '&::-webkit-scrollbar': {
              display: 'none'
            },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}>
            {navItems.map((item) => (
              <Tooltip key={item.path} title={item.tooltip} arrow>
                {isSmallScreen ? (
                  <IconButton
                    component={Link}
                    to={item.path}
                    color="inherit"
                    sx={{
                      p: { xs: 1, sm: 1.5 },
                      m: 0.5,
                      minWidth: 'auto',
                      backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      '& svg': {
                        fontSize: { xs: '1.25rem', sm: '1.5rem' }
                      }
                    }}
                  >
                    {item.icon}
                  </IconButton>
                ) : (
                  <Button
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      my: 1,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      backgroundColor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      },
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      px: 2,
                    }}
                  >
                    {item.text}
                  </Button>
                )}
              </Tooltip>
            ))}
          </Box>

          {!isSmallScreen && (
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/vocab"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: 'secondary.main',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
                color: 'white',
                textTransform: 'none',
                ml: { xs: 1, sm: 2 },
                mr: { xs: 1, sm: 0 },
                whiteSpace: 'nowrap',
                minWidth: 'fit-content',
                py: { xs: 0.75, sm: 0.75 },
                px: { xs: 1, sm: 2 },
                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                '& .MuiButton-startIcon': {
                  marginRight: { xs: 0.5, sm: 1 }
                }
              }}
            >
              Tambah Kosakata
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}