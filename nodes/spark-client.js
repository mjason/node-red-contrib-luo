module.exports = function(RED) {
  function SparkClientNode(config) {
    RED.nodes.createNode(this, config);

    this.sparkConfig = RED.nodes.getNode(config.sparkConfig);

    this.on('input', async (msg, send, done) => {
      const { SparkClient } = await import('luo_sdk');

      if (!this.sparkConfig || !this.sparkConfig.accessToken) {
        this.status({ fill: 'red', shape: 'dot', text: '没有设置token' });
        done();
        return;
      }

      const token = this.sparkConfig.accessToken;
      const sparkClient = new SparkClient({ token });

      const temperature = msg.payload?.temperature ?? config.temperature ?? 0.5;
      const uid = msg.payload?.uid;
      const max_tokens = msg.payload?.max_tokens ?? config.max_tokens ?? 1024;
      const stream = msg.payload?.stream ?? config.stream ?? false;
      const messages = msg.payload?.messages ?? [];

      const streamCallback = async (chunk, content) => {
        send([null, { payload: { chunk, content } }]);
      }

      try {
        const response = await sparkClient.completions({ temperature, uid, max_tokens, stream, messages, streamCallback });
        msg.payload = response;
        send([msg, { payload: { done: response } }]);

        this.status({fill: 'green', shape: 'dot', text: '请求成功'});
        done();
      } catch (e) {
        this.status({fill: 'red', shape: 'dot', text: '请求失败'});
        const error = new Error(e.response.body);
        done(error);
      }

    });
  }
  RED.nodes.registerType("spark-client", SparkClientNode);
}