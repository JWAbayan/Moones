import HappyEmoji from "/img/emoji_happy.webp"

export default function Home({}){
    return(
        <div className="flex flex-col  w-screen h-screen font-display p-6" >
            <header className="flex">
                <h1 className=" font-bold uppercase" >Moones</h1>
            </header>
            <main className="flex flex-col items-center">
                <div className="flex flex-col justify-center items-center mt-20">
                    <img className="h-55 w-55" src={HappyEmoji} alt="happy-emoji" />
                </div>
                <div className="flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-black uppercase mt-15">
                        The <span className="text-yellow "> music player </span> 
                        <br/> 
                        that matches 
                        <br/>  
                        your 
                        <span className="text-yellow"> mood </span>
                    </h1>
                    <h2 className="mt-8">
                        Discover and listen to indie music 
                        <br/>
                        that gets your every mood
                    </h2>
                </div>

                <button className="bg-yellow p-3 rounded-xl mt-15 font-bold shadow-xl hover:scale-105 transition-all ease-in">
                    Start setting the mood
                </button>
            </main>
        </div>
    )
}