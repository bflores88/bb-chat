import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import websocket from 'socket.io';

import ClientManager from './services/ClientManager';
import ChatroomManager from './services/ChatroomManager';
import makeHandlers from './services/handler';

const clientManager = ClientManager();
const chatroomManager = ChatroomManager();

const app = express();
const server = http.Server(app);
const io = websocket.listen(server);
const port = 8080;

app.use(express.static('../public'));

app.use(
	bodyParser.urlencoded({
		extended: true,
	}),
);

io.on('connection', function(client) {
	const {
		handleRegister,
		handleJoin,
		handleLeave,
		handleMessage,
		handleGetChatrooms,
		handleGetAvailableUsers,
		handleDisconnect,
	} = makeHandlers(client, clientManager, chatroomManager);

	console.log('client connected...', client.id);

	client.on('register', handleRegister);

	client.on('join', handleJoin);

	client.on('leave', handleLeave);

	client.on('message', handleMessage);

	client.on('chatrooms', handleGetChatrooms);

	client.on('availableUsers', handleGetAvailableUsers);

	client.on('disconnect', function() {
		console.log('client disconnect...', client.id);
		handleDisconnect();
	});

	client.on('error', function(err) {
		console.log('received error from client:', client.id);
		console.log(err);
	});
});

app.get('/', (req, res) => {
	return res.status(200).json({ success: true });
});

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
