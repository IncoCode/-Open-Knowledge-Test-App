/**
 * Development environment settings
 * @description :: This section overrides all other config values ONLY in development environment
 */

module.exports = {
    models: {
        connection: "mongo"
    },
    connections : {
        mongo: {
            adapter: 'sails-mongo',
            host: "localhost",
            port: 27017,
            user: "",
            password: "",
            database: "test"
        }
    }
};
