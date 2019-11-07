import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Loader from '../components/Loader';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import styled from 'styled-components';
import FullScreen from '../containers/Fullscreen';
import { Redirect } from 'react-router-dom';

const Wrapper = styled(FullScreen)`
	background-color: tranparent;
	z-index: 5;
	text-align: center;
`;

class UserSelection extends Component {
	constructor(props) {
		super(props);

		this.state = {
			availableUsers: null,
		};
	}

	componentDidMount() {
		if (!this.props.user) {
			this.props.getAvailableUsers((err, availableUsers) => {
				this.setState({ availableUsers });
			});
		}
	}

	render() {
		let userItems = null;
		if (this.state.availableUsers) {
			userItems = this.state.availableUsers.map((u) => {
				return (
					<React.Fragment key={u.id}>
						<ListItem button onClick={() => this.props.register(u.username)}>
							<ListItemAvatar>
								<Avatar src={u.image} />
							</ListItemAvatar>
							<ListItemText primary={u.username} secondary={u.statusText} />
						</ListItem>
					</React.Fragment>
				);
			});
		}

		return (
			<React.Fragment>
				{this.props.user ? <Redirect to="/" /> : null}
				<Wrapper>
					<Dialog open>
						<DialogTitle id="simple-dialog-title">Pick a user</DialogTitle>
						<List>{!userItems ? <Loader /> : userItems}</List>
					</Dialog>
				</Wrapper>
			</React.Fragment>
		);
	}
}

export default UserSelection;
