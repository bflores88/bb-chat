import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';

const styles = makeStyles({
	avatar: {
		margin: 10,
	},
	bigAvatar: {
		margin: 10,
		width: 60,
		height: 60,
	},
});

const AvatarWrapper = styled.div`
	cursor: pointer;
	display: flex;
	max-width: 150px;
	flex-direction: column;
	align-items: center;
	a {
		text-decoration: none;
	}
`;

const Username = styled.p`
	font-size: 24px;
	text-align: center;
	color: #ccc;
	margin: 0;
`;

const avatar = ({ user }) => {
	const classes = styles();

	let iconImage = user
		? { src: user.image }
		: {
				children: <PersonIcon />,
		  };

	let username = user ? `$user.username` : 'Who are you?';

	return (
		<AvatarWrapper>
			<Avatar className={classes.bigAvatar} {...iconImage} />
			<Username>{username}</Username>
		</AvatarWrapper>
	);
};
export default avatar;
