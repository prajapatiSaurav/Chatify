import friendRequest from "../models/FriendRequest.model.js";
import User from "../models/user.model.js"

export async function getRecommendedUsers(req,res){
    try {

        const currentuserId = req.user._id;

        const currentuser = req.user;

        const recommendedUsers = await User.find({
            $and :[
                {_id : {$ne : currentuserId}},   // not included his own profile
                {_id: {$nin : currentuser.friends}},  // not included friend profile in recomondation
                {isOnboarded : true}    // only onboared profile will be there
            ]
        }).select("-password -email");

        console.log("user list : ",recommendedUsers)


        res.status(200).json(recommendedUsers)
    
    } catch (error) {
        console.log("Error in recomonded user List",error.message)
        res.status(500).json({message:"Internal Server Error"})
    }

}

export async function getMyfriends(req,res){
    try {
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(user.friends)
    } catch (error) {
        console.log("Error while Getting friend liist",error.message)
        res.status(500),json({message : "Internal server Error"})
    }

}

export async function sendFriendRequest(req,res) {
    try {
        const myId = req.user.id;
        const { id : recipientId} = req.rarams;
        
        if(myId === recipientId) return res.status(400).json({message : "You cant send friend request to yourself"});

        const recipient = await User.findById(recipientId);

        if (!recipient) return res.status(400).json({message : "Ricipient not exist"});

        // check for recipient is allready friend
        if(recipient.friends.includes(myId)){
            return res.status(400).json({messge : "You are allready friend with the user"});
        };

        //check if a req already exist

        const existingRequest = await friendRequest.findOne({
            $or:[
                {sender : myId , recipient : recipientId},
                {sender : recipientId , recipient : myId}
            ]   
        })

        if(existingRequest){
            return res.status(400).json({message : "A friend request exixts between you and this user"})
        }

        const friend = await friendRequest.create({
            sender : myId,
            recipient : recipientId
        })

        res.status(201).json(friend)
    } catch (error) {
        console.log("Error while sending friend request : ", error.message)
        res.status(500).json({message : "Internal server error"})
        
    }
}

export async function acceptSendFriendRequest(req,res) {

    try {
        const myId = req.user.id;
        const {id : requestId} = req.params;

        const friendRequest = await friendRequest.findById(requestId);

        if(!friendRequest) return res.status(403).json({message : "No such request exist"})

        if( friendRequest.recipient.toString() !== myId ){
             return res.status(403).json({message : "You do not have access to this request"})
        }

        friendRequest.status = "accepted";
        await friendRequest.save();
        
        //adding both the user to each others friend list

        await User.findByIdAndUpdate(friendRequest.recipient,
            { $addToSet: { friends: friendRequest.sender } }, // add user in to recipient friend list
            { new: true }
        )
        
        await User.findByIdAndUpdate(friendRequest.sender,
            { $addToSet: { friends: friendRequest.recipient } }, // add recipient to sender friend list
            { new: true }
        )

        res.status(200).jason({message : "Friend request accepted"})
        
    } catch (error) {
        console.log("Error while acepting the friend request",error.message)
        res.status(500).json({message :" Internal server error"});
        
    }

}

export async function getFriendRequest(req,res) {
    try {
        const incomingRequest = await friendRequest.find({
            recipient : req.user.id,
            status : "pendding"
        }).popupate("sender","fullName bio profilePic nativeLanguage learningLanguage")

        const outgoingRequest = await friendRequest.find({
            sender : req.user.id,
            status : "pendding"
        }).popupate("recipient","fullName bio profilePic nativeLanguage learningLanguage")

        res.status(200).json({incomingRequest,outgoingRequest})

    } catch (error) {
        console.log("error getting data of incomi and out going req : ",error.message)
    }
    
}

export async function getSendedRequests(req,res) {
    try {
         const outgoingRequest =  friendRequest.find({
            sender : req.user.id,
            status : "pendding"
        }).popupate("recipient","fullName bio profilePic nativeLanguage learningLanguage")

        res.status(200).json({outgoingRequest})
    } catch (error) {
        
    }
}