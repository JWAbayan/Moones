import { useState, useEffect, useRef } from "react";
import SampleTrack from "/audio/Natsuhisyou.flac"
import { Howl, Howler } from "howler";
import SampleImage from "/img/sample_image.png"
import { ChevronRightIcon, PauseIcon, PlayIcon, ChevronLeftIcon } from "../../../public/svg/Icons";
import { fetchTrackByID, fetchTracksByMood } from "../../utils/api";
import { useLocation, useParams, useSearchParams } from "react-router";
import { Moods } from "../../utils/moods";

function PlaybackControlButton({onClick, icon, disabled, bgColor}){
    return(
        <button 
            className={`flex justify-center items-center rounded-full size-16 shadow mt-10 ${bgColor}`}
            onClick={onClick}
            disabled={disabled}
        >
         {
            icon
         }   
        </button>
    )
}

function TrackImageSkeleton (){
    return(
        <div className="absolute size-85 mt-20 rounded-2xl animate-pulse bg-amber-100 border-0">
           
        </div>
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

    const [imageLoaded, setImageLoaded] = useState(false)
    
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
           pos: 0,
           autoplay: true,
           shuffle: false,
    })

    /**
     * 
     * Router Hooks
     * 
    */
   const locationState = useLocation();
   const [searchParams, setSearchParams] = useSearchParams();
   
    const playbackPosUI = useRef(null);

    var updatePlaybackPosInterval = useRef();
    const updateDelay = 500; 
    

    useEffect(()=>{
        if(locationState.state){
            console.log(`HAS LOCATION STATE: ${locationState.state}`);
            setupPlayer(locationState.state)
        }else{
            fetchMoones(searchParams[0].get("mood"))
        }
    
        return ()=>{
            clearInterval(updatePlaybackPosInterval.current);
        }
    },[])
    
    useEffect(()=> {
        if(!playingTrack.audio) return

        playingTrack.audio.once("end", () => {
            if(playbackStates.autoplay){
                changeTrack();
                // playerStates.shuffle ? changeTrack() : changeTrack(1)
            }
            else
                setPlaybackStates({...playbackStates, paused: true})
        })
        
        playingTrack.audio.play();
        updatePlaybackPosOnInterval(playingTrack.audio);

        setPlaybackStates({...playbackStates, paused: false})
        
        return(()=>{
            playingTrack.audio.unload();
        })
    },[playingTrack])

    /**
     * 
     * Effect
     * 
     * Dependencies:
     * 
     * @playbackStates.paused
     * 
     * Calls Playing Track's Pause() or Play() depending on the value of playerStates.paused 
     * Also sets a new playback pos interval when played
     * 
     */
    useEffect(()=>{
        if(!playingTrack.audio) return;
        
        if(playbackStates.paused){
            playingTrack.audio.pause();
        }else{
            playingTrack.audio.play();
            updatePlaybackPosOnInterval(playingTrack.audio)
        }
    },[playbackStates.paused])

    async function fetchMoones(mood){
        await fetchTracksByMood(mood).then(fetchedTracks => {
            setupPlayer({tracks: fetchedTracks, mood: mood})
        })
    }
    
    /****
     * 
     * setupPlayer() 
     * 
     * @state : Object<playerState> -  
     * 
     * Sets the new player state and loads the track inside it by calling
     * 
     */
    function setupPlayer(state){

        if(state.playMultiple){
            const newPlayerState = {...playerStates, mood:state.mood, tracks:state.tracks}
            setPlayerStates(newPlayerState)
            loadTrack(state.tracks, 0)
            return;
        }

        
        fetchTrackByID(state.trackID).then(fetchedTrack => {
            if(!fetchedTrack){
                return;
            }

            setPlayerStates({
                ...playerStates,
                mood: state.mood,
                tracks: fetchedTrack,
                playingIndex: 0
            });

            loadTrack(fetchedTrack, 0);
            return;
        })
    }


    /***
     * 
     * loadTrack() - tracks : Array<object> 
     * 
     * @tracks : Array<Object> - list of necessary information of all fetched tracks
     * @index : number - identifier used to load tracks from tracks
     * 
     * Creates a new Howl instance for the selected track and sets it as the new playingTrack when loaded 
     * 
     */
    function loadTrack(tracks, index){
        const track = tracks[index].track;

        if(!track){
            return;
        }

        const trackURL = track.audio;
        const trackTitle = track.name;
        const trackArtist = track.artist_name;
        const trackImgURL = track.album_image;

        setImageLoaded(false);

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
                    duration: howlInstance.duration(),
                });

            },
            onloaderror: (id ,error) => {
                console.error("Error Loading Track!: " + error)
            }
        })

    }

    function adjustVolume(value){
        
    }

    function updatePlaybackPosOnInterval(audio){
        if(!audio){              
            return;
        } 

        if(updatePlaybackPosInterval.current) clearInterval(updatePlaybackPosInterval.current)

        updatePlaybackPosInterval.current = setInterval(()=>{
            setPlaybackStates(playbackStates => ({...playbackStates, pos: audio.seek()}))
        }, updateDelay)
    }
    /***
     * 
     * handlePlaybackChange()
     * 
     * @event : Interface 
     * 
     * 
     */
    function handlePlaybackChange(event){
        if(!playingTrack.audio) return;

        playingTrack.audio.seek(event.target.value);
        updatePlaybackPosOnInterval(playingTrack.audio);

        //When paused, automatically play the track when 
        // user manually changed the playback position
        setPlaybackStates(playbackStates.paused ? 
            {...playbackStates, paused: false, pos:event.target.value}:
            {...playbackStates, pos:event.target.value}
        )

    }

    function handlePause(pause){
        setPlaybackStates({...playbackStates, paused: !pause})
    }

    function getRandomTrackIndex(currentIndex, tracksLength){
        let index = Math.floor(Math.random() * (tracksLength - 1)) 

        if(index === currentIndex){
            index += 1;

            if(index >= tracksLength){
                index = 0
            }
        }

        return index
    }

    function changeTrack(step){
        if(playerStates.tracks.length == 0) {
            return;
        }

        let nextTrackIndex = 0;

        if(step){
            nextTrackIndex = playerStates.playingIndex + step;
        }else{
            nextTrackIndex = getRandomTrackIndex(playerStates.playingIndex, playerStates.tracks.length)
        }

        const trackIndexInBounds = nextTrackIndex >= 0 
            && nextTrackIndex < playerStates.tracks.length; 

        if(trackIndexInBounds){
            loadTrack(playerStates.tracks, nextTrackIndex);
            setPlayerStates(playerStates=>({
                ...playerStates,
                playingIndex: nextTrackIndex
            }))
        }
    }

    
    return(
        <div className="w-full flex flex-col items-center font-display">
            {
              !imageLoaded && <TrackImageSkeleton/>
            }
            <img 
                className="size-85 mt-20 rounded-2xl object-cover border-0" 
                src={playingTrack.img} 
                onLoad={()=> {
                    setImageLoaded(true);
                }}
            />
            <div className="flex flex-col items-center mt-10">
                <h1 className=" font-bold ">{playingTrack.title}</h1>
                <h2 className=" text-sm text-gray-500 mt-1">{playingTrack.artist}</h2>
            </div>
            <div className="flex flex-col items-center mt-20 w-full">
                <input className="shadow accent-yellow w-[80%]" 
                    ref={playbackPosUI} 
                    type="range" 
                    value={playbackStates.pos} 
                    min={0} 
                    max={playingTrack.duration} 
                    onChange={handlePlaybackChange} 
                    disabled={!playingTrack}
                />
                <div className="flex w-full justify-evenly">
                    <PlaybackControlButton 
                        icon={<ChevronLeftIcon/>} 
                        disabled={!playingTrack || playerStates.playingIndex == 0}
                        onClick={() => changeTrack(-1)} 
                    />
                    <PlaybackControlButton 
                        icon={playbackStates.paused ? <PlayIcon/>: <PauseIcon/>} 
                        onClick={() => handlePause(playbackStates.paused)}
                        disabled={!playingTrack.audio}
                         bgColor={"bg-yellow"}
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