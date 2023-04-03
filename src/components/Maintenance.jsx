import { useEffect, useState } from "react";

export const Maintenance = () => {
  
  return(
    <div className="flex items-center justify-around h-screen w-screen">
      <div>
        <div className="justify-around flex"><img style={{width: 64}} src="fightclub_7.png" alt="" /></div>
        <h2 className="mt-4" style={{fontSize: 24, fontFamily: 'League Spartan'}}>Manutenzione in corso...</h2>
      </div>
    </div>
  );
}