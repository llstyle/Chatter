import jwt from 'jsonwebtoken';
import DeviceToken from '../models/DeviceToken.js';

class DeviceService {
    async saveToken(userId, deviceToken) {
        const tokenData = await DeviceToken.findOne({user: userId})
        if (tokenData) {
            tokenData.deviceToken = deviceToken;
            return await tokenData.save();
        }
        const token = await DeviceToken.create({user: userId, deviceToken: deviceToken})
        return token
    }
}

export default new DeviceService();