import mongoose from "mongoose";

const DeviceTokenSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    deviceToken: {type: String, required: false}
})

export default mongoose.model('DeviceToken', DeviceTokenSchema);