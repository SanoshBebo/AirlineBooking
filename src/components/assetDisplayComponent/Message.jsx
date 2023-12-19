import { Box } from '@mui/material'
import plane from "../../assets/plane.png";
import React from 'react'

const Message = ({data}) => {
  return (
    <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "60vh",
    }}
  >
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column-reverse",
      }}
    >
      <h1 className="font-bold text-xl p-5 text-[#990011]">
        {data}
      </h1>
      <img src={plane} alt="" className="w-1/3" />
    </Box>
  </div>
  )
}

export default Message