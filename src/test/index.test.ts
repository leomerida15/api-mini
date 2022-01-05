import tap from "tap";
import Server from "../app";

const build = async () => {
    const app = await Server()

    app.get('/', async function (request, reply) {
        return { hello: 'world' }
    })

    return app
}

const test = async () => {
    const app = await Server()

    const response = await app.inject({
        method: 'GET',
        url: '/'
    })

    // console.log('status code: ', response.statusCode)
    // console.log('body: ', response.body)
}
test()