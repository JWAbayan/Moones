import { useState, useEffect, useRef } from "react";
import SampleTrack from "/audio/Natsuhisyou.flac"
import { Howl, Howler } from "howler";
import SampleImage from "/img/sample_image.png"
import { ChevronRightIcon, PauseIcon, PlayIcon, ChevronLeftIcon } from "../../../public/svg/Icons";
import { requestTracksByMood } from "../../utils/api";
import { useLocation, useParams, useSearchParams } from "react-router";
import { Moods } from "../../utils/moods";

function PlaybackControlButton({onClick, icon, disabled}){
    return(
        <button 
            className="flex justify-center items-center rounded-full size-16 bg-yellow shadow mt-10" 
            onClick={onClick}
            disabled={disabled}
        >
         {
            icon
         }   
        </button>
    )
}

export default function Player(){
    
    /***
     * 
     * @mood : Mood object : represents the mood of the player. i.e Moods.happy, Moods.sad
     * @tracks : Array<object> : list of info of all fetched tracks based on mood
     * @playingIndex : number : represents the index of the playing track in the tracks array
     * 
    */
    const [playerStates, setPlayerStates] = useState({
        mood: Moods.happy,
        tracks: [],
        playingIndex: 0,
    })

    /***
     * 
     * @audio : Howl object : Howl instance of the playing track
     * @img : string : image URL of the playing track 
     * @title : string : title of the playing track
     * @artist : string : artist(s) of the playing track
     * @duration : number : total duration of the track in seconds
     * 
    */
    const [playingTrack, setPlayingTrack] = useState({
        audio: null, 
        img: null,
        title: "Track Title",
        artist: "Artist 1",
        duration: 60,
    })
    
    /***
     * 
     * @paused : boolean : tells the playback if its paused or not 
     * @volume : number 0-1 : the volume of the playback ranging from 0(mute) to 1(full volume)
     * @autoplay : boolean : tells the playback to continue loading and playing audio from tracks array
     * 
    */
     const [playbackStates, setPlaybackStates] = useState({
           paused: true,
           volume: 1,
           autoplay: true,
           pos: 0
     })

    /**
     * 
     * Router Hooks
     * 
    */
   const locationState = useLocation();
   const searchParams = useSearchParams();
   
    const playbackPosUI = useRef(null);

    var updatePlaybackPosInterval = useRef();
    const updateDelay = 500; 
    

    useEffect(()=>{
        if(locationState.state){
            console.log("HAS LOCATION STATE");
            setupPlayer(locationState.state)
        }
        
        else{
            console.log("RELYING ON QUERY PARAMS");
            fetchTracks(searchParams[0].get("mood"))
        }

        // const instance = new Howl({
        //     src:[SampleTrack],
        //     onload:()=>{
        //         setPlayingTrack({...playingTrack, audio: instance, duration:instance.duration()});
        //     }
        // })


        return ()=>{
            clearInterval(updatePlaybackPosInterval.current);
        }
    },[])
    
    //Effect when the playingTrack changes
    useEffect(()=> {
        if(!playingTrack.audio) return

        playingTrack.audio.play();
        
        setPlaybackStates({...playbackStates, paused: false})

        return(()=>{
            playingTrack.audio.unload();
        })
    },[playingTrack])

    //Effect when playbackStates changes
    useEffect(()=>{
        if(!playingTrack.audio) return;

        console.log("Pause State Changed");
        console.log(playbackStates.paused)
        
        if(updatePlaybackPosInterval.current) clearInterval(updatePlaybackPosInterval.current)

        if(playbackStates.paused){
            playingTrack.audio.pause();
        }else{
            playingTrack.audio.play();
            updatePlaybackPosOnInterval(playingTrack.audio)
        }
    },[playbackStates.paused])

    async function fetchTracks(mood){
        await requestTracksByMood(mood).then(fetchedTracks => {
            setupPlayer({tracks: fetchedTracks, mood: mood})
        })
    }
    
    function setupPlayer(state){
        const newPlayerState = {...playerStates, mood:state.mood, tracks:state.tracks}

        setPlayerStates(newPlayerState)

        loadTrack(state.tracks, 0)
    }

    function loadTrack(tracks, index){
        const track = tracks[index];

        if(!track){
            return;
        }

        const trackURL = track.audio;
        const trackTitle = track.name;
        const trackArtist = track.artist_name;
        const trackImgURL = track.album_image;

        const howlInstance = new Howl({
            src: [trackURL],
            volume: playerStates.volume,
            autoplay:false,
            html5:true,
            format:["mp3"],
            onload: () => {
                if(playingTrack.audio) 
                    playingTrack.audio.unload();
                
                setPlayingTrack({
                    audio: howlInstance,
                    img: trackImgURL,
                    title: trackTitle,
                    artist: trackArtist,
                })
            },
            onloaderror: (id ,error) => {
                console.error("Error Loading Track!: " + error)
            }
        })

    }

    function adjustVolume(value){
        currentTrack.track.volume(value);
    }

    function updatePlaybackPosOnInterval(audio){
        if(!audio){
            console.log("Audio Empty");                
            return;
        } 

        updatePlaybackPosInterval.current = setInterval(()=>{
            setPlaybackStates(playbackStates => ({...playbackStates, pos: audio.seek()}))
        }, updateDelay)
    }

    function handlePlaybackChange(event){
        if(!playingTrack.audio) return;

        if(updatePlaybackPosInterval.current){
            clearInterval(updatePlaybackPosInterval.current);
        } 

        updatePlaybackPosOnInterval(playingTrack.audio)
        playingTrack.audio.seek(event.target.value)
        setPlaybackStates(playbackStates => ({...playbackStates, pos: event.target.value}))

        // if(playbackStates.paused) {
        //     playingTrack.audio.play();
        //     setPlaybackStates(playbackStates=>({...playbackStates, paused: false}));
        // }
            

        
       
    }

    function handlePause(){
        setPlaybackStates(playbackStates => ({...playbackStates, paused: !playbackStates.paused}))
    }

    function changeTrack(step){
        const nextTrackIndex = playerStates.playingIndex + step;

        const trackIndexInBounds = nextTrackIndex >= 0 && nextTrackIndex < playerStates.tracks.length; 

        if(trackIndexInBounds){
            loadTrack(playerStates.tracks, nextTrackIndex);
            setPlayerStates(playerStates=>({
                ...playerStates,
                playingIndex: nextTrackIndex,
            }))
        }
            
        else
            console.log("Next Track Index is out of bounds")
    }

    
    return(
        <div className="w-full flex flex-col items-center font-display">
            <img className="size-85 mt-20 rounded-2xl object-cover " src={playingTrack.img} alt="cover" />
            <div className="flex flex-col items-center mt-10">
                <h1 className=" font-bold ">{playingTrack.title}</h1>
                <h2 className=" text-sm text-gray-500 mt-1">{playingTrack.artist}</h2>
            </div>
            <div className="flex flex-col items-center mt-20 w-full">
                <input className=" shadow accent-yellow w-[80%] " ref={playbackPosUI} type="range" value={playbackStates.pos} min={0} max={playingTrack.duration} onChange={handlePlaybackChange} disabled={!playingTrack}/>
                <div className="flex w-full justify-evenly">
                    <PlaybackControlButton 
                        icon={<ChevronLeftIcon/>} 
                        disabled={!playingTrack || playerStates.playingIndex == 0}
                        onClick={() => changeTrack(-1)} 
                    />
                    <PlaybackControlButton 
                        icon={playbackStates.paused ? <PlayIcon/>: <PauseIcon/>} 
                        onClick={()=> handlePause()} 
                        disabled={!playingTrack.audio}
                    />
                    <PlaybackControlButton 
                        icon={<ChevronRightIcon/>} 
                        onClick={() => changeTrack(1)} 
                        disabled={!playingTrack || playerStates.playingIndex == playerStates.tracks.length - 1}  
                    />
                </div>
            </div>
            
        </div>
    );
}