import { useEffect, useRef } from "react"
import { PopupTypes } from "../../utils/types/popupTypes"

export default function MessageSnackbar({type, message}){

    function setColors(type){
        switch(type){
            case PopupTypes.Affirm:
                return "border-green-400 bg-affirm-green"
            case PopupTypes.Error:
                return " border-red-300 bg-error-red"
        }
    }

    return(
        <div className={`${setColors(type)} bg-error text-white z-100 w-3/4 p-5 text-center 
        fixed border-1 
        rounded-sm left-1/2 -translate-x-1/2 `}>
            <p className="font-display text-sm " >{message}</p>
        </div>
    )
}