module.exports = function(RED) {
  function SparkConfig(config) {
    RED.nodes.createNode(this, config);
    this.accessToken = config.accessToken;
  }
  RED.nodes.registerType("spark-config", SparkConfig);
}