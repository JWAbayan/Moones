import { useCallback, useRef } from "react"

export default function useIntersectionObserver({callback, options}){

  const ref = useRef(null);

  const setRef = useCallback(node=>{
    const observer = new IntersectionObserver(callback, options);
    
    if(ref.current){
      observer.unobserve(ref.current);
    }

    if(node){
      observer.observe(node);  
    }

    ref.current = node;
  })
  
  return setRef;
}