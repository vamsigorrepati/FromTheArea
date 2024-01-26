import * as React from 'react';
import Rating from '@mui/material/Rating';
import { styled } from '@mui/material/styles';

export default function BasicRating({onRatingChange}) {
  const [value, setValue] = React.useState(2);

  const NewRating = styled(Rating)(({ theme }) => ({

    // display: 'flex',
    // justifyContent: 'center',

    '& .MuiSvgIcon-root': {
      fontSize: '2rem',
      
      '@media (min-width: 500px)': {
          fontSize: '3rem',
        },
  
      '@media (min-width: 1024px)': {
          fontSize: '5rem',
        },
      margin: '0 0.6em',
    },
    
  }));

  return (

    
      <NewRating
        name="simple-controlled"
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          onRatingChange(newValue);
        }}
      />

  );
}