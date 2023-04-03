import { SpinnerCircular } from "spinners-react";

export const Loading = () => {
  return(
    <div style={{backgroundColor: 'black', overflowY: 'hidden', zIndex: 5, top: 0, position: 'fixed', overflowY: 'hidden'}} className="opacity-50 w-screen h-screen flex justify-around items-center">
      <SpinnerCircular thickness={140} speed={284} color="white" size={84} enabled={true} />
    </div>
  );
}