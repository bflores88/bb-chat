import styled from 'styled-components';
import FullScreen from './Fullscreen';

export default styled(FullScreen)`
	background: ${(props) => props.background};
	opacity: ${(props) => props.opacity};
`;
