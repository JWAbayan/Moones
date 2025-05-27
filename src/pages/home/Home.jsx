import { useNavigate } from "react-router"

import HappyEmoji from "/img/emoji_happy.webp"

export default function Home({}){
    const navigate = useNavigate();

    return(
        <div className="h-full w-full flex flex-col items-center md:grid md:grid-cols-2 md:grid-rows-1 md:justify-end">
            <div className="flex flex-col justify-center items-center mt-10 md:order-2">
                <img className="size-55 md:size-120" src={HappyEmoji} alt="happy-emoji" />
            </div>
            <div className="flex flex-col justify-center items-center text-center md:text-start md:items-start md:order-1 md:px-10 ">
                <h1 className="text-4xl font-black uppercase mt-15 md:text-6xl md:mt-5">
                    The <span className="text-yellow "> music player </span> 
                    <br/> 
                    that matches 
                    <br/> 
                    your <span className="text-yellow"> mood </span>
                </h1>
                <h2 className="mt-8 md:text-xl md:mt-8">
                    Discover and listen to indie music 
                    <br/> 
                    that gets your every mood
                </h2>
                <button className="bg-yellow p-3 rounded-xl mt-15 font-bold shadow-xl hover:scale-105 transition-all ease-in md:px-6 md:text-sm"
                    onClick={()=>navigate("/mood")}
                >
                    Start setting the mood
                </button>
            </div>
        </div>
    )
}