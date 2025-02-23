import { log } from "node:console";
import React from "react";
import { useState, useEffect } from "react";

const header = ({ score }) => {
  // console.log((score).type);
  // const bestMovesCount = localStorage.get(gridsize);

  return (
    <div className="bg-green-600 flex flex-row justify-around items-center text-white font-dmmono py-4 font-bold">
      <div className="text-2xl">Memory Tiles</div>
      <div className="flex flex-row justify-around items-center gap-[25px]">
        <div className="bg-white text-black px-3 py-1 rounded-[5px]">
          Best Move Count:{" "}
        </div>
        <div className="bg-white text-black px-3 py-1 rounded-[5px]">
          Best Time:{" "}
        </div>
      </div>
    </div>
  );
};

export default header;
