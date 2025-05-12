import fastify, {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';

const server: FastifyInstance = fastify({
    logger: true
});

interface ItemParams {
    id: string;
}

interface ItemBody {
    name: string;
    price: number;
}

// Routes
server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    return {message: 'Fastify API is running!'};
});

server.get<{ Params: ItemParams }>(
    '/items/:id',
    async (request, reply) => {
        const {id} = request.params;
        return {item: {id, name: `Item ${id}`, price: 9.99}};
    }
);

server.post<{ Body: ItemBody }>(
    '/items',
    {
        schema: {
            body: {
                type: 'object',
                required: ['name', 'price'],
                properties: {
                    name: {type: 'string'},
                    price: {type: 'number'}
                }
            }
        }
    },
    async (request, reply) => {
        const {name, price} = request.body;
        return {
            message: 'Item created',
            item: {id: Date.now().toString(), name, price}
        };
    }
);

const start = async () => {
    try {
        await server.listen({port: 3000, host: '0.0.0.0'});
        console.log(`Server running at http://localhost:3000`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();