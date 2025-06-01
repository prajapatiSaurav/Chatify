import {StreamChat} from "stream-chat";
import "dotenv/config"

const apikey = process.env.STREAM_API_KEY
const apisecret = process.env.STREAM_API_SECRET

if (!apikey || ! apisecret) console.error("Stream Api key or secret missing");

const stream_client = new StreamChat(apikey,apisecret,{
  disableCache: true
});

export const upsertStreamUser = async (userData)=>{
    try {
        await stream_client.upsertUsers([userData]);
        return userData
    } catch (error) {
        console.log("Error while creating stream user");
    }
}