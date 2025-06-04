import axios from "axios"


const reqInstance = axios.create({
    baseURL: "http://localhost:3000/v1.0",
    timeout: 20000,
})


const feed = { 
    featuredPopular:[],
    featuredSad: [],
} 

export async function fetchTracksByMood(mood){
    return reqInstance.get("/moones", {
        params:{
            mood: mood
        }
    }).then(res => {
        if(res.status !== 200){
            console.log("Failed Request")
            return;
        }

        return res.data.tracks;
    }).catch(error => {
        return
        console.log(error);
    })
}

export async function fetchFeatured(){
    return reqInstance.get("/featured").then( res =>{
        if(res.data.status !== 200){
            console.log("Failed Request")
            return;
        }
        console.log(res.data.tracks);
        return res.data.tracks;
    }).catch(error => {
        console.log(error);
    })
} 

export async function fetchTrackByID(trackID){
    return reqInstance.get("/tracks", {
        params: {
            trackID: trackID,
        }
    })
    .then( res =>{
        if(res.data.status !== 200){
            console.log("Failed Request")
            return;
        }

        console.log(res.data);

        return res.data.results;
    })
    .catch(error => {
        console.log(error);
    })
}