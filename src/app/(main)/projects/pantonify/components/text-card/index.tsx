import React from "react";
import './index.css'


export default function TextCard({children, header}: {children:React.ReactNode, header?:string}){
    return <div  className="font-helvetica text-card flex flex-col">
        {header && <h1>{header}</h1>}
        {children}
    </div>
}