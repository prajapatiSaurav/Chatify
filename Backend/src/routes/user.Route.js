import express from "express";
import {protectedRoute} from "../middleware/auth.middleware.js"
import {getRecommendedUsers,getMyfriends,sendFriendRequest,acceptSendFriendRequest,getSendedRequests,getFriendRequest} from "../controller/user.Controller.js"

const router = express.Router();

//to protect all the route here
router.use(protectedRoute)

router.get("/",getRecommendedUsers);
router.get("/friends",getMyfriends)

router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptSendFriendRequest);

router.get("/in-out-request",getFriendRequest);
router.get("/pending-request",getSendedRequests);

export default router