module.exports = function(RED) {
  function SparkEmbeddingNode(config) {
    RED.nodes.createNode(this, config);
    this.sparkConfig = RED.nodes.getNode(config.sparkConfig);

    this.on("input", async (msg, send, done) => {
      const { SparkClient } = await import('luo_sdk');

      if (!this.sparkConfig || !this.sparkConfig.accessToken) {
        this.status({ fill: 'red', shape: 'dot', text: '没有设置token' });
        done();
        return;
      }

      const token = this.sparkConfig.accessToken;
      const sparkClient = new SparkClient({ token });

      try {
        let response = await sparkClient.embedding({input: msg.payload.input});
        send({ payload: response.body});
        this.status({fill: 'green', shape: 'dot', text: '请求成功'});
        done();
      } catch (e) {
        this.status({fill: 'red', shape: 'dot', text: '请求失败'});
        console.log(e)
        done(e);
      }
    });
  }

  RED.nodes.registerType("spark-embedding", SparkEmbeddingNode);
}