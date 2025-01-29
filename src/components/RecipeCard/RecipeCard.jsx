/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const RecipeCard = ({ title, syrup, espresso, iceMilk, creamDecoration }) => {
  return (
    <Card
      sx={{
        maxWidth: 400,
        margin: '20px auto',
        padding: '20px',
        background: 'linear-gradient(to bottom, #f8f9fa, #e9ecef)',
        boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
        borderRadius: '12px',
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{ fontWeight: 'bold', marginBottom: '10px', color: '#343a40' }}
        >
          {title}
        </Typography>
        <Box sx={{ marginBottom: '15px' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Şurup:
          </Typography>
          {syrup.map((item, index) => (
            <Typography key={index} variant="body1">
              {item}
            </Typography>
          ))}
        </Box>
        <Box sx={{ marginBottom: '15px' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Espresso:
          </Typography>
          <Typography variant="body1">{espresso}</Typography>
        </Box>
        <Box sx={{ marginBottom: '15px' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Buz ve Süt:
          </Typography>
          <Typography variant="body1">{iceMilk}</Typography>
        </Box>
        <Box sx={{ marginBottom: '15px' }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Krema ve Dekorasyon:
          </Typography>
          <Typography variant="body1">{creamDecoration}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecipeCard;
