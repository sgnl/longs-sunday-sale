
'use strict';
const server = require('./server');
const logger = require('./services/logger');

const PORT = process.env.PORT;

server.listen(PORT, () => logger.info(`server started on http://localhost:${PORT}`));
