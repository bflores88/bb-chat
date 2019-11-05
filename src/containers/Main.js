import React from 'react';
import Avatar from '../components/Avatar';
import FullScreen from '../containers/Fullscreen';
import styled from 'styled-components';

const Wrapper = styled.div`
	font-family: 'Roboto', sans-serif;
	padding: 2em 3em;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
`;

class Main extends React.Component {
	render() {
		return (
			<FullScreen>
				<Wrapper>
					<Avatar />
					<div>{this.props.children}</div>
				</Wrapper>
			</FullScreen>
		);
	}
}

export default Main;
