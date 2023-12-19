import { Box, CircularProgress, Skeleton } from "@mui/material";
import React from "react";

const MediaLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <Box
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "150px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <CircularProgress className="p=5" /> */}
        <Skeleton variant="rounded" width={600} height={200} />
        <Skeleton variant="rounded" width={600} height={200} />
        <Skeleton variant="rounded" width={600} height={200} />
        <Skeleton variant="rounded" width={600} height={200} />
      </Box>
    </div>
  );
};

export default MediaLoader;
