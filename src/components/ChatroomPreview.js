import React from 'react';
import styled from 'styled-components';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const styles = makeStyles({
	media: {
		height: 250,
	},
	pos: {
		margin: 5,
	},
});

const Wrapper = styled.div`
	cursor: pointer;
`;

const chatroomPreview = (props) => {
	const chatroom = props.chatroom;
	const onEnter = props.onEnter;
	const classes = styles();

	return (
		<Paper style={{ maxWidth: 600, marginBottom: 20 }}>
			<Wrapper onClick={onEnter}>
				<Card>
					<CardActionArea>
						<CardMedia //
							key={chatroom.name}
							className={classes.media}
							image={chatroom.image}
						/>
						<Typography variant="body2" className={classes.pos} gutterBottom>
							{chatroom.name}
						</Typography>
					</CardActionArea>
				</Card>
			</Wrapper>
		</Paper>
	);
};

export default chatroomPreview;
