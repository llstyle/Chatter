import { createClient } from 'redis';

const URL_REDIS_CONN = process.env.URL_REDIS_CONN
export async function sendMessage(message, users) {
    try {
        const publisher = createClient({ url: URL_REDIS_CONN });
        await publisher.connect()
        await publisher.publish("message", JSON.stringify({message, users}))
    } catch (e) {
        console.log(e)
    }
}
export async function sendMessageTopic(message, topic) {
    try {
        const publisher = createClient({ url: URL_REDIS_CONN });
        await publisher.connect()
        await publisher.publish("messageTopic", JSON.stringify({message, topic}))
    } catch (e) {
        console.log(e)
    }
}
export async function subcribeTopic(users, topic) {
    try {
        const publisher = createClient({ url: URL_REDIS_CONN });
        await publisher.connect()
        await publisher.publish("subscribe", JSON.stringify({users, topic}))
    } catch (e) {
        console.log(e)
    }
}
export async function unsubcribeTopic(users, topic) {
    try {
        const publisher = createClient({ url: URL_REDIS_CONN });
        await publisher.connect()
        await publisher.publish("unsubscribe", JSON.stringify({users, topic}))
    } catch (e) {
        console.log(e)
    }
}