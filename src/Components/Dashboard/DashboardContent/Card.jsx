import React from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";

function Card({data}) {
  return (
    <Box className="col grid">
      {data?.map((card) => {
        return (
          <Link className="card" key={card.id} to={card.to}>
            <Typography className="title">{card.title}</Typography>
            <Typography className="desc">{card.desc}</Typography>
          </Link>
        );
      })}
    </Box>
  );
}

export default Card;
