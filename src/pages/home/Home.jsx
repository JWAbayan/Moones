import { useNavigate } from "react-router"

import HappyEmoji from "/img/emoji_happy.webp"
import { useEffect, useState, useRef } from "react";
import { fetchFeatured } from "../../utils/api";

function TrackCard({img, heading, subheading, trackID, mood}){
    const navigate = useNavigate();

    function navigateToPlayer(){
       navigate(`/player/?mood=${mood}&track=${trackID}`, {state: {mood: mood, trackID:trackID, playMultiple: false}}) 
    }

    return(
        <div className="flex flex-col min-h-30 min-w-30 mr-10 mb-7 whitespace-nowrap overflow-hidden overflow-ellipsis">
            <img className="rounded-lg object-cover" src={img} alt="track-img" onClick={navigateToPlayer}/>
            <h1 className="font-display mt-3 text-sm text-gray-800">{heading}</h1>
            <h2 className="font-display text-xs mt-1 text-gray-500">{subheading}</h2>
            <h2 className="font-display text-xs mt-1 text-gray-500 capitalize">{mood}</h2>
        </div>
    );
}   

function TrackCardSkeleton (){
    return(
        <div className=" shrink-0 size-30 mr-10 mb-5 whitespace-nowrap animate-pulse bg-amber-100 rounded-xl">
           
        </div>
    )
}

function ScrollableList({horizontal, items}){ 
    return(
        <div className={`flex ${horizontal ? "overflow-x-scroll" : "flex-col overflow-y-scroll"} w-full mt-5`}>
        {
            items.length === 0 ? 
                
                Array(10).fill(null).map(e => {
                    return <TrackCardSkeleton />
                }):
                items.map(item => {
                    return (
                        <TrackCard 
                            key={item.track.id} 
                            img={item.track.album_image}
                            heading={item.track.name}
                            subheading={item.track.artist_name}
                            trackID={item.track.id}
                            mood={item.mood}
                        />
                    )
                }) 
        }
        </div>
    );
}

function FormInput({type, name, placeholder, onChange, valid, value}){

    return(
        <div className={`flex border-1 ${valid || !value ? "border-gray-200" : "border-red-400"} mt-5 rounded-sm p-2 relative w-full`}>
            <input 
                name={name}  
                type={type} 
                placeholder={placeholder}
                className=" border-0 outline-0 flex-2/3 text-sm"
                onChange={onChange}
                required
            />
            {
                (!valid && value)  && 
                <p className="bg-gradient-to-r from-transparent via-white to-white z-10 text-red-400 pl-3 text-sm">
                    Invalid
                </p>
            }
        </div>
    )
}

function FormTextArea({ name, placeholder, onChange, valid, value}){

    return(
        <div className={`flex flex-col border-1 ${valid || !value ? "border-gray-200" : "border-red-400"} mt-5 rounded-sm p-2 relative w-full`}>
            <textarea   
                name={name} 
                placeholder={placeholder}
                className="border-0 outline-0 rounded-sm resize-none text-sm"
                onChange={onChange}
                maxLength={250}
                required    
            /> 
            {
                <p className={`${(!value || valid) && "opacity-0"} bg-gradient-to-r from-transparent via-white to-white text-red-400 text-sm`}>
                    Invalid
                </p>
            }
        </div>
    )
}

export default function Home({}){
    const navigate = useNavigate();
    const [featured, setFeatured] = useState({
        week: [],
        sad: [],
    })
    const [messageInfo, setMessageInfo] = useState({
        name: "",
        email: "",
        message: ""
    })

    const [infoValidity, setInfoValidity] = useState({
        validEmail: false,
        validName: false,
        validMessage: false,
    })

    useEffect(()=>{
        fetchFeatured().then(res => {
            if(!res){
                return;
            }
            
            setFeatured({
                week: res.featuredWeek,
                sad: res.featuredSad,
            })
        })
    },[])

    function handleNameChange(e){
        const name = e.target.value;
        const validName = name.replace(/\s/g, "").length > 0;
        setInfoValidity({...infoValidity, validName: validName})
        setMessageInfo({...messageInfo, name: e.target.value})
    }
    
    function handleEmailChange(e){
        const emailRegex = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
        setInfoValidity({...infoValidity, validEmail: emailRegex.test(e.target.value)});
        setMessageInfo({...messageInfo, email: e.target.value})
    }
    
    function handleMessageChange(e){
        const message = e.target.value
        const validMessage = message.replace(/\s/g, "").length >= 8;
        setInfoValidity({...infoValidity, validMessage: validMessage})
        setMessageInfo({...messageInfo, message: e.target.value})
    }

    function submitContactForm(event){
        event.preventDefault();
    }
    
    return(
        <div className="h-full w-full flex flex-col items-center md:grid md:grid-cols-2 md:grid-rows-1 md:justify-end">
            {/* <div className="flex flex-col justify-center items-center mt-10 md:order-2">
                <img className="size-55 md:size-120" src={HappyEmoji} alt="happy-emoji" />
            </div> */}
            <div className="w-full flex flex-col justify-center md:text-start md:items-start md:order-1 md:px-10 ">
                <h1 className="text-4xl font-bold uppercase mt-15 md:text-6xl md:mt-5">
                    The <span className="text-yellow "> music player </span> 
                    <br/> 
                    that matches 
                    <br/> 
                    your <span className="text-yellow"> mood </span>
                </h1>
                <h2 className="mt-6 md:text-xl md:mt-8 text-gray-500">
                    Discover and listen to indie music 
                    <br/> 
                    that gets what
                </h2>
                <button className="bg-yellow w-60 p-3 rounded-xl mt-12 font-bold shadow-xl hover:scale-105 transition-all ease-in md:px-6 md:text-sm"
                    onClick={()=>navigate("/mood")}
                >
                    Start setting the mood
                </button>
            </div>
            <div className="flex flex-col mt-14 w-full">
                <h1 className="font-display font-bold overflow-x-scroll border-b-1 border-gray-300 pb-2" >Popular this week</h1>
                <ScrollableList horizontal={true} items={featured.week}/>
                <h1 className="font-display font-bold overflow-x-scroll border-b-1 border-gray-300 pb-2 mt-3" >Let these tracks accompany you</h1>
                <ScrollableList horizontal={true} items={featured.sad}/>
            </div>
            <div className="flex flex-col mt-14 w-full pb-5">
                <h1 className="font-display font-bold text-4xl">
                    Let's get in touch
                </h1>
                <h2 className="font-display mt-3 text-gray-500">
                    Have any questions or suggestions <br/> We are here to listen.
                </h2>
                <form className="flex flex-col min-w-full space-y-1 relative" onSubmit={submitContactForm}>
                    <FormInput 
                        type={"text"} 
                        name={"Name"} 
                        placeholder={"Name"} 
                        onChange={handleNameChange}
                        valid={infoValidity.validName}
                        value={messageInfo.name}  
                    />
                    <FormInput 
                        type={"email"} 
                        name={"Email"} 
                        placeholder={"Email"} 
                        onChange={handleEmailChange}
                        valid={infoValidity.validEmail}
                        value={messageInfo.email}  
                    />
                    <FormTextArea
                        name={"message"}
                        placeholder={"Message"}
                        onChange={handleMessageChange}
                        valid={infoValidity.validMessage}
                        value={messageInfo.message}
                    />
                </form>
            </div>
        </div>
    )
}