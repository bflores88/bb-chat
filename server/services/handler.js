function makeHandleEvent(client, clientManager, chatroomManager) {
	function checkExistence(getter, rejectMessage) {
		let res = getter();
		return res;
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

	function checkValidChatroomAndUserSelected(chatroomName) {
		return Promise.all([checkValidChatroom(chatroomName), checkUserSelected(client.id)]).then(([chatroom, user]) =>
			Promise.resolve({ chatroom, user }),
		);
	}

	async function handleEvent(chatroomName, createEntry) {
		return checkValidChatroomAndUserSelected(chatroomName).then(({ chatroom, user }) => {
			// append event to chat history
			const entry = { user, ...createEntry() };
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
		const createEntry = () => ({ event: `joined ${chatroomName}` });
		console.log(chatroomName);
		handleEvent(chatroomName, createEntry)
			.then((chatroom) => {
				// add member to chatroom
				chatroom.addUser(client);
				console.log('user added to chatroom');
				return callback(null);
			})
			.catch(callback);
	}

	function handleLeave(chatroomName, callback) {
		const createEntry = () => ({ event: `left ${chatroomName}` });

		handleEvent(chatroomName, createEntry)
			.then((chatroom) => {
				// remove member from chatroom
				chatroom.removeUser(client.id);

				// send chat history to client
				return callback(null), chatroom.getChatHistory();
			})
			.catch(callback);
	}

	function handleMessage({ chatroomName, message } = {}, callback) {
		const createEntry = () => ({ message });

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
