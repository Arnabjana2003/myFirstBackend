import { Subscription } from "../models/subscription.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const subscribe = asyncHandler(async (req,res)=>{
    const {channelId} = req.body
    if(!channelId) throw new ApiError(505, "channel id is required")

    const alreadySubscribed = await Subscription.findOne({
        $and: [{subscriber: req.userData?._id},{channel:channelId}]
    })
    if(alreadySubscribed) throw new ApiError(400, 'Multiple subscription not allow')
    
    await Subscription.create({
        subscriber: req.userData?._id,
        channel: channelId
    })

    return res
    .status(200)
    .json(new ApiResponse(200,"Subscribed",{}))
})

export {subscribe};