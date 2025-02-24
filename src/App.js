import './App.css';
import React from 'react';
import web3 from './web3';
import lottery from './lottery';
import logo from './logo.svg';

class App extends React.Component {
	state = {
		manager: '',
		players: [],
		balance: '',
		value: '',
		message: '',
	};

	async componentDidMount() {
		const manager = await lottery.methods.manager().call();
		const players = await lottery.methods.getPlayers().call();
		const balance = await web3.eth.getBalance(lottery.options.address);

		this.setState({ manager, players, balance });
	}

	onSubmit = async (event) => {
		event.preventDefault();
		const accounts = await web3.eth.getAccounts();

		this.setState({ message: 'Waiting on transaction success...' });

		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei(this.state.value, 'ether'),
		});

		this.setState({ message: 'You have been entered!' });
	};

	onClick = async (event) => {
		const accounts = await web3.eth.getAccounts();
		this.setState({ message: 'Picking winner...' });
		await lottery.methods.pickWinner().send({
			from: accounts[0],
		});
		const winner = await lottery.methods.lastWinner().call();
		this.setState({ message: `The winner is: ${winner}!` });
	};

	render() {
		return (
			<div className="App">
				<header className="App-header">
					<h2>Lottery Contract</h2>
					<img src={logo} className="App-logo" alt="logo" />
					<p className="padding">
						This contract is managed by {this.state.manager}
					</p>
				</header>

				<p>
					There are currently {this.state.players.length} people
					entered, competing to win{' '}
					{web3.utils.fromWei(this.state.balance, 'ether')} ether!
				</p>

				<hr />

				<form onSubmit={this.onSubmit}>
					<h4>Want to try your luck?</h4>
					<div>
						<label>Amount of ether to enter</label>
						<input
							onChange={(event) =>
								this.setState({ value: event.target.value })
							}
						/>
					</div>
					<input
						type="submit"
						value="Enter"
						className="button-style"
					/>
				</form>

				<hr />

				<h4>Ready to pick a winner?</h4>
				<button onClick={this.onClick} className="button-style">
					Pick a Winner!
				</button>
				<h1>{this.state.message}</h1>
			</div>
		);
	}
}
export default App;
