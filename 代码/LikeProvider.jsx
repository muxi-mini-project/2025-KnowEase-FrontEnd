import React,{ useState,useContext,createContext } from "react";
const LikeContext=createContext();
const LikeProvider=({children})=>{
    const [likeStatusMap,setLikeStatusMap]=useState({});
    const [saveStatusMap,setSaveStatusMap]=useState({});
    const toggleLike=(id)=>{
        setLikeStatusMap((preMap)=>({
            ...preMap,
            [id]:!preMap[id]
        }));
    };
    const toggleSave=(id)=>{
        setSaveStatusMap((preMap)=>({
            ...preMap,
            [id]:!preMap[id]
        }));
    };
    return(
        <LikeContext.Provider value={{likeStatusMap,toggleLike,saveStatusMap,toggleSave}}>
            {children}
        </LikeContext.Provider>
    )
}
export {LikeContext,LikeProvider};