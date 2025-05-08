export default function Home({}){
    return(
        <div className="flex flex-col w-screen font-display p-6" >
            <header className="flex">
                <h1 className=" font-bold uppercase" >Moones</h1>
            </header>
            <main>
                <div className="flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-black uppercase mt-10">
                        The <span className="text-yellow "> music player </span> 
                        <br/> 
                        that matches 
                        <br/>  
                        your 
                        <span className="text-yellow"> mood </span>
                    </h1>
                    <h2>
                        Discover and listen to music 
                        <br/>
                        that gets your every mood
                    </h2>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <img src="" alt="" />
                    <h1>
                        Tap to discover
                    </h1>
                </div>
            </main>
        </div>
    )
}