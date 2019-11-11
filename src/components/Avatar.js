import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import { Link } from 'react-router-dom';

const styles = makeStyles({
	avatar: {
		margin: 10,
		width: 80,
		height: 80,
	},
	bigAvatar: {
		margin: 10,
		width: 120,
		height: 120,
		backgroundColor: '#fcdd60',
	},
});

const AvatarWrapper = styled.div`
	cursor: pointer;
	display: flex;
	max-width: 150px;
	flex-direction: column;
	align-items: center;
	z-index: 10;
	a {
		text-decoration: none;
	}
`;

const Username = styled.p`
	font-size: 24px;
	text-align: center;
	color: #fcdd60;
	margin: 0;
`;

const avatar = (props) => {
	const classes = styles();

	let iconImage = props.user
		? { src: props.user.image }
		: {
				children: <PersonIcon className={classes.avatar} size="large" />,
		  };

	let username = props.user ? `${props.user.username}` : 'Who are you?';

	let completeAvatar = (
		<AvatarWrapper>
			<Avatar className={classes.bigAvatar} {...iconImage} />
			<Username>{username}</Username>
		</AvatarWrapper>
	);

	if (!props.user) {
		completeAvatar = (
			<Link to="/user" style={{ textDecoration: 'none' }}>
				{completeAvatar}
			</Link>
		);
	}

	return completeAvatar;
};
export default avatar;
