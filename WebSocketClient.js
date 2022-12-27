class WebSocketClient {
	constructor(url) {
		this.url = url;
		this.client = new WebSocket(this.url);
		this.client.onmessage = this.onMessage;
		this.client.onerror = err => console.log('Error while connecting to the server: ' + err);

		console.log('WebSocketClient initialized!');
	}

	send(message) {
    
		try {
			if (this.client) this.client.send(JSON.stringify(message));
			else console.log('Could not send message: ', message);
		} catch (error) {
			console.log('errr - ', error);
		}
	}

	onMessage = message => {
		const messagePayload = JSON.parse(message.data);
		console.log('Received message from the server: ', messagePayload);

		if (this.onReceiveMessage) this.onReceiveMessage(messagePayload);
	};

	close = () => {
		this.client.close();
	};
}

const client = new WebSocketClient('ws://127.0.0.1:8080/ws');

export default client;
