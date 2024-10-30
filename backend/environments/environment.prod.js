const environment = {
    production: true,
    port: 8080,
    defaultAdminPassword: 'c3uz#3zd',
    db:{
        host: 'iar-mongo.inf.h-brs.de',
        port: 27017,
        username: 'team_15',
        password: 'team_15!',
        authSource: 'team_15',
        name: 'team_15'
    },
    corsOrigins: [
        'http://iar-frontend.inf.h-brs.de'
    ]
};

exports.default = environment;