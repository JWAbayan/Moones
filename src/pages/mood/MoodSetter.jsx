import { useState } from "react";
import { useNavigate } from "react-router";
import HappyEmoji from "/img/emoji_happy.webp"
import RelaxEmoji from "/img/emoji_relax.webp"
import SadEmoji from "/img/emoji_sad.webp"
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { fetchTracksByMood } from "../../utils/api";
import { useSelector } from "react-redux";


const MoodMap = [
    {
        title: "Happy",
        name: "happy",
        img: HappyEmoji,
    },
    {
        title: "Relaxed",
        name: "relaxed",
        img: RelaxEmoji,
    },
    {
        title: "Sad",
        name: "sad",
        img: SadEmoji,
    }
]

function Moods({mood, isSearching, searchSongs, setMoodName}){

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: [0.0, 0.5],
    }
      
    const iObserveableComponent = useIntersectionObserver({
        callback: entries => scaleOnView(entries),
        options: observerOptions
    })
    
    function scaleOnView(entries){
        if(!entries) return;

        entries.forEach(entry => {
            let entryClassList = entry.target.classList
            
            entryClassList.remove(entry.isIntersecting ? "scaleOut" : "scaleIn")
            entryClassList.add(entry.isIntersecting ? "scaleIn" : "scaleOut")

            //Change the name of the current mood when half of the next mood is visible
            if(entry.intersectionRatio >= 0.5) setMoodName(mood.name)

        })
    }

    return(
        <div key={mood.name} className="flex flex-col justify-center w-100 h-100 flex-shrink-0 text-center snap-center">
            <span className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-50 rounded-full bg-yellow opacity-75 animate-ping ${isSearching? "block" : "hidden"}`}></span>
            <img onClick={searchSongs} ref={iObserveableComponent} src={mood.img} alt="mood-emoji" className="size-90 object-contain mx-auto z-100" />
        </div>
    );
} 

export default function MoodSetter(){
    const [moodName, setMoodName] = useState("")
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();

    async function searchSongs(mood){
        setIsSearching(true);

        fetchTracksByMood(mood).then(tracks => {
            setIsSearching(false);
            navigate(`/player/?mood=${mood}`, {state: {mood: mood, tracks: tracks, playMultiple: true}})
        });

    }

    return(
        <div className="flex flex-col justify-center text-center w-full">
            <h1 className="mb-10 font-display font-black text-4xl text-gray-700 ">{isSearching ? "Searching for your moones" : "Set the mood"}</h1>
            <div className="relative">
                <div className="flex overflow-x-scroll box-content space-x-4 snap-x snap-mandatory scrollbar-hide ">
                    {
                        MoodMap.map(mood => (
                            <Moods mood={mood} isSearching={isSearching} searchSongs={() => searchSongs(mood.name)} setMoodName={setMoodName} />
                        ))
                    }
                </div>
                {/* Left gradient blur */}
                <div className="pointer-events-none absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-white to-transparent z-101"></div>

                {/* Right gradient blur */}
                <div className="pointer-events-none absolute top-0 right-0 h-full w-8 bg-gradient-to-l from-white to-transparent z-101"></div>
            </div>
            <div className="flex justify-center font-display text-xl mt-5">
                <h1 className={`${isSearching ? "hidden" : ""}`}>{moodName}</h1>
                <button className={`${isSearching ? "block" : "hidden"}`} onClick={()=>setIsSearching(false)}> Cancel </button>
            </div>
        </div>
    );
}