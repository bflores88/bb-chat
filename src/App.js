import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Home from './containers/Home/Home';

class App extends Component {
	render() {
		return (
			<>
				<Switch>
					<Route exact path="/" component={Home} />
				</Switch>
			</>
		);
	}
}

export default hot(App);
