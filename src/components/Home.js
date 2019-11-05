import React from 'react';
import styled from 'styled-components';

import ChatroomPreview from './ChatroomPreview';

const Wrapper = styled.div`
	width: 300px;

	@media (min-width: 576px) {
		width: 600px;
	}
`;

const home = (props) => {
	const chatrooms = props.chatrooms;
	const onEnterChatroom = props.onEnterChatroom;

	let homeContent = null;

	if (chatrooms) {
		homeContent = chatrooms.map((c) => (
			<ChatroomPreview key={c.name} chatroom={c} onEnter={() => onEnterChatroom(c.name)} />
		));
	}

	return <Wrapper>{homeContent}</Wrapper>;
};

export default home;
