import User from "../models/User.js";
import Chat from "../models/Chat.js";

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
            console.log(e)
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
            res.status(500).send("Any troubles on server")
        }
    }
}
export default new ChatController()