import React from 'react';
import styled from 'styled-components';
import Loader from '../components/Loader';

import ChatroomPreview from '../components/ChatroomPreview';

const Wrapper = styled.div`
	width: 300px;

	@media (min-width: 576px) {
		width: 600px;
	}
`;
const home = (props) => {
	let homeContent = <Loader />;

	if (props.chatrooms) {
		homeContent = props.chatrooms.map((c) => (
			<ChatroomPreview //
				key={c.name}
				chatroom={c}
				onEnter={() => props.onEnterChatroom(c.name)}
			/>
		));
	}

	return <Wrapper>{homeContent}</Wrapper>;
};

export default home;
