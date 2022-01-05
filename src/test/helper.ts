import start from "../app";

const buildTestServer = async (tap: any) => {
    const server = await start();

    server.get("/error", async (request, reply) => {
        throw new Error("Error provocado");
    });

    tap.tearDown(() => {
        server.close();
    });

    return server;
};

export default buildTestServer;