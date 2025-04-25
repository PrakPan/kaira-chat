import Image from "next/image";
import React from "react";

const BackArrow=({handleClick})=>{

    return(
        <div className="flex items-center gap-[11px] cursor-pointer" onClick={handleClick}>
            <Image src="/backarrow.svg" width={30} height={30}/>
            <div className="text-[16px]">
                Back
            </div>
        </div>
    )
};

export default BackArrow;