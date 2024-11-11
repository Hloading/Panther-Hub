const { getDataConnect, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'portfolio2',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

