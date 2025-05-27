import axios from "axios"


const reqInstance = axios.create({
    baseURL: "http://localhost:3000/v1.0",
    timeout: 20000,
})

export async function requestTracksByMood(mood){
    return reqInstance.get("/moones", {
        params:{
            mood: mood
        }
    }).then(res => {
        if(res.status !== 200){
            console.log("Failed Request")
            return;
        }

        return res.data;
    }).catch(error => {
        console.log(error);
    })
}

export async function getHighlightTracks(){

}

