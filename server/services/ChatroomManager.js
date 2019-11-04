import Chatroom from './Chatroom';
import ChatroomTemplates from '../database/chatrooms';

export default function() {
	const chatrooms = new Map(ChatroomTemplates.map((c) => [c.name, Chatroom(c)]));

	function removeClient(client) {
		chatrooms.forEach((c) => c.removeUser(client));
	}

	function getChatroomByName(chatroomName) {
		return chatrooms.get(chatroomName);
	}

	function serializeChatrooms() {
		return Array.from(chatrooms.values()).map((c) => c.serialize());
	}

	return {
		removeClient,
		getChatroomByName,
		serializeChatrooms,
	};
}
