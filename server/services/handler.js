function makeHandleEvent(client, clientManager, chatroomManager) {
	async function checkExistence(getter, rejectMessage) {
		try {
			let response = await getter();
			return response;
		} catch (err) {
			console.error(err);
			return rejectMessage;
		}
	}

	function checkUserSelected(clientId) {
		return checkExistence(() => clientManager.getUserByClientId(clientId), 'select user first');
	}

	function checkValidChatroom(chatroomName) {
		return checkExistence(
			() => chatroomManager.getChatroomByName(chatroomName),
			`invalid chatroom name: ${chatroomName}`,
		);
	}

	async function checkValidChatroomAndUserSelected(chatroomName) {
		const [chatroom, user] = await Promise.all([checkValidChatroom(chatroomName), checkUserSelected(client.id)]);
		return await Promise.resolve({ chatroom, user });
	}

	async function handleEvent(chatroomName, createEntry) {
		return checkValidChatroomAndUserSelected(chatroomName).then(function({ chatroom, user }) {
			// append event to chat history
			const entry = { user, ...createEntry };
			console.log(entry);
			chatroom.addEntry(entry);

			// notify other clients in the chatroom
			chatroom.broadcastMessage({ chat: chatroomName, ...entry });
			return chatroom;
		});
	}

	return handleEvent;
}

export default (client, clientManager, chatroomManager) => {
	const handleEvent = makeHandleEvent(client, clientManager, chatroomManager);

	function handleRegister(userName, callback) {
		if (!clientManager.isUserAvailable(userName)) {
			return callback('user is not available');
		}

		const user = clientManager.getUserByName(userName);
		clientManager.registerClient(client, user);
		return callback(null, user);
	}

	function handleJoin(chatroomName, callback) {
		const createEntry = { event: `joined ${chatroomName}` };

		handleEvent(chatroomName, createEntry)
			.then((chatroom) => {
				// add member to chatroom
				chatroom.addUser(client);

				// send chat history to client
				const chatHistory = chatroom.getChatHistory();

				return callback(null, chatHistory);
			})
			.catch(callback);
	}

	function handleLeave(chatroomName, callback) {
		const createEntry = { event: `left ${chatroomName}` };

		handleEvent(chatroomName, createEntry)
			.then((chatroom) => {
				// remove member from chatroom
    chatroom.removeUser(client.id);
    console.log(createEntry)

				return callback(null);
			})
			.catch(callback);
	}

	function handleMessage({ chatroomName, message } = {}, callback) {
		const createEntry = { message };

		handleEvent(chatroomName, createEntry)
			.then(() => callback(null))
			.catch(callback);
	}

	function handleGetChatrooms(_, callback) {
		return callback(null, chatroomManager.serializeChatrooms());
	}

	function handleGetAvailableUsers(_, callback) {
		return callback(null, clientManager.getAvailableUsers());
	}

	function handleDisconnect() {
		// remove user profile
		clientManager.removeClient(client);

		// remove member from all chatrooms
		chatroomManager.removeClient(client);
	}

	return {
		handleRegister,
		handleJoin,
		handleLeave,
		handleMessage,
		handleGetChatrooms,
		handleGetAvailableUsers,
		handleDisconnect,
	};
};
