module.exports = {
    adapters: {
        'mongo': require('sails-mongo')
    },

    connections: {
        mongo: {
            adapter: 'mongo',
            host: "localhost",
            port: 27017,
            user: "",
            password: "",
            database: "test"
        }
    }
};
