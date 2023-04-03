import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../config";

export const Menu = ({param}) => {

  const navigate = useNavigate()

  return(
    <div style={{height:114}} className="bg-[#242a33] justify-around flex w-screen">
      <div className="items-center flex">
        {
          param == 'home' ? (
            <>
              <div style={{cursor: 'pointer', width: 134}}>
                <div onClick={(e) => navigate("/")} style={{borderBottomWidth: 3.4, borderBottomColor: COLORS[0], width: 114}} className="justify-around items-center flex p-5"><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Home</h2></div>
              </div>
              <div style={{cursor: 'pointer', width: 134}}>
                <div onClick={(e) => window.location.href = 'https://store.fightclubmc.net'} style={{backgroundColor: COLORS[0], borderRadius: 15, height: 54, width: 114}} className={"justify-around items-center flex p-5"}><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Store</h2></div>
              </div>
              <div style={{cursor: 'pointer', width: 134}}>
                <div onClick={(e) => navigate("/forum")} style={{width: 114}} className="justify-around items-center flex p-5"><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Forum</h2></div>
              </div>
            </>
          ):(
            param == 'forum' ? (
              <>
                <div style={{cursor: 'pointer', width: 134}}>
                  <div onClick={(e) => navigate("/")} style={{width: 114}} className="justify-around items-center flex p-5"><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Home</h2></div>
                </div>
                <div style={{cursor: 'pointer', width: 134}}>
                  <div onClick={(e) => window.location.href = 'https://store.fightclubmc.net'} style={{backgroundColor: COLORS[0], borderRadius: 15, height: 54, width: 114}} className={"justify-around items-center flex p-5"}><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Store</h2></div>
                </div>
                <div style={{cursor: 'pointer', width: 134}}>
                  <div onClick={(e) => navigate("/forum")} style={{borderBottomWidth: 3.4, borderBottomColor: COLORS[0], width: 114}} className="justify-around items-center flex p-5"><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Forum</h2></div>
                </div>
              </>
            ):(
              <>
                <div style={{cursor: 'pointer', width: 134}}>
                  <div onClick={(e) => navigate("/")} style={{width: 114}} className="justify-around items-center flex p-5"><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Home</h2></div>
                </div>
                <div style={{cursor: 'pointer', width: 134}}>
                  <div onClick={(e) => window.location.href = 'https://store.fightclubmc.net'} style={{backgroundColor: COLORS[0], borderRadius: 15, height: 54, width: 114}} className={"justify-around items-center flex p-5"}><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Store</h2></div>
                </div>
                <div style={{cursor: 'pointer', width: 134}}>
                  <div onClick={(e) => navigate("/forum")} style={{width: 114}} className="justify-around items-center flex p-5"><h2 className="text-[#ffffff] text-xl" style={{fontFamily: 'League Spartan'}}>Forum</h2></div>
                </div>
              </>
            )
          )
        }
      </div>
    </div>
  );
}