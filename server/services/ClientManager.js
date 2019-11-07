import userTemplates from '../database/users';

export default function() {
	const clients = new Map();

	function addClient(client) {
		clients.set(client.id, { client });
	}

	function registerClient(client, user) {
		clients.set(client.id, { client, user });
	}

	function removeClient(client) {
		clients.delete(client.id);
	}

	function getAvailableUsers() {
		const usersTaken = new Set(
			Array.from(clients.values())
				.filter((c) => c.user)
				.map((c) => c.user.username),
		);

		return userTemplates.filter((u) => !usersTaken.has(u.username));
	}

	function isUserAvailable(userName) {
		return getAvailableUsers().some((u) => u.username === userName);
	}

	function getUserByName(userName) {
		return userTemplates.find((u) => u.username === userName);
	}

	function getUserByClientId(clientId) {
		return (clients.get(clientId) || {}).user;
	}

	return {
		addClient,
		registerClient,
		removeClient,
		getAvailableUsers,
		isUserAvailable,
		getUserByName,
		getUserByClientId,
	};
}
