import Chat from "../models/Chat.js";
import logger from "../utils/logger.js";

class ChatController {
    async createChat(req, res) {
        try {
            if(!req.body.chatter || req.user.user_id === req.body.chatter) {
                res.status(400).send("chatter is required")
                return;
            }
            const users = [req.body.chatter, req.user.user_id]

            const exist = await Chat.findOne({users: { $all : users }})

            if(exist) {
                res.status(400).send("Chat is already exist")
                return;
            }

            const created = await Chat.create({users: users})
            res.status(200).send(created)
            return;

        } catch (e) {
            logger.error(e.message)
            res.status(500).send("Any troubles on server")
        }
    }
    async deleteChat(req, res) {
        try {
            if(!req.body.chatter || req.user.user_id === req.body.chatter) {
                res.status(400).send("chatter is required")
                return;
            }
            const users = [req.body.chatter, req.user.user_id]

            const exist = await Chat.findOne({users: { $all : users }})

            if(exist) {
                res.status(400).send("Chat is already exist")            
                
                return;
            }

            const created = await Chat.create({users: users})
            res.status(200).send(created)
            return;

        } catch (e) {
            logger.error(e.message)
            res.status(500).send("Any troubles on server")
        }
    }
    async get_All(req, res) {
        try {
            const chats = await Chat.find({}).populate({ path:"mess", match: { "users": {"$ne": req.user.user_id  } } }) 
            res.status(200).send(chats)
            return;

        } catch (e) {
            logger.error(e.message)
            res.status(500).send("Any troubles on server")
        }
    }
}
export default new ChatController()
