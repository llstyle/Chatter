import { createClient } from 'redis';
import logger from './logger.js';

const URL_REDIS_CONN = process.env.URL_REDIS_CONN
const publisher = createClient({ url: URL_REDIS_CONN });

export async function sendMessage(message, users) {
    try {
        await publisher.connect()
        await publisher.publish("message", JSON.stringify({message, users}))
        await publisher.disconnect()
    } catch (e) {
        logger.error(e.message)
    }
}
export async function sendMessageTopic(message, topic) {
    try {
        await publisher.connect()
        await publisher.publish("messageTopic", JSON.stringify({message, topic}))
        await publisher.disconnect()
    } catch (e) {
        logger.error(e.message)
    }
}
export async function subcribeTopic(users, topic) {
    try {
        await publisher.connect()
        await publisher.publish("subscribe", JSON.stringify({users, topic}))
        await publisher.disconnect()
    } catch (e) {
        logger.error(e.message)
    }
}
export async function unsubcribeTopic(users, topic) {
    try {
        await publisher.connect()
        await publisher.publish("unsubscribe", JSON.stringify({users, topic}))
        await publisher.disconnect()
    } catch (e) {
        logger.error(e.message)
    }
}