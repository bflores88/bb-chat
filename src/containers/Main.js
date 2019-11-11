import React from 'react';
import FullScreen from '../containers/Fullscreen';
import styled from 'styled-components';

const Wrapper = styled.div`
	font-family: 'Roboto', sans-serif;
	padding: 2em 3em;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	background-color: rgba(255, 255, 255, 0.4);
	height: -webkit-fill-available;
`;

class Main extends React.Component {
	render() {
		return (
			<FullScreen>
				<Wrapper>{this.props.children}</Wrapper>
			</FullScreen>
		);
	}
}

export default Main;
