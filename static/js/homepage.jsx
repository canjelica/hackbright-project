"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const MContext = React.createContext();






class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			userId: '',
			name: '',
			isLoggedIn: false
		};
		this.userLoggedIn = this.userLoggedIn.bind(this);
	}

	userLoggedIn = (userId, name, email) => {
		this.setState({
			isLoggedIn: true,
			userId: userId,
			name: name,
			email: email
		});
	}

	render() {
		const userId = sessionStorage.getItem('userId');
		if (userId) {
			return(
			<div>

				<Dashboard userLoggedIn={this.props.userLoggedIn} />

				<Router>
					<Switch>
						<Route exact path="/dashboard">
							<Dashboard exact path="/dashboard"/>
						</Route>
						<Route exact path="/add-new">
							<TrackNewAccount exact path="/add-new"/>
						</Route>
						<Route exact path="/myprofile">
							<UserProfile exact path="/myprofile" />
						</Route>
						<Route exact path="/mycards">
							<CCAccount exact path="/mycards" />
						</Route>
					</Switch>
				</Router>

			</div>
			)
		} else {
			return (
				<div>
					<Router>
						<Switch>
							<Route exact path="/">
								<Homepage exact path="/" />
								<Login exact path="/login" userLoggedIn = {this.userLoggedIn} />
							</Route>
							<Route exact path="/register">
								<Registration exact path="/register"/> 
							</Route>
						</Switch>
					</Router>
				</div>
				)
			};
		}
	}


class Homepage extends React.Component {
	constructor() {
		super();
	}

	render() {
		return (
			<div className="container-fluid">
				<span>
					<img id="homepage-logo" className="rounded mx-auto d-block" src="../static/img/Logo-text.gif" />
				</span>
					
				<div className="headline">
					
					<p id="headline" >Welcome travelhacker! </p>

					C&B is simple tool which tracks your credit card spending from approval to spending deadline, and allows you to see which card bonuses you're working on. 
					<p></p>
					Never miss out on a points bonus again.
				</div>
					
				<div className="byline">
					Churn it. Burn it. Move on.
				</div>
			</div>
		)
	}

}	

class Dashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedIn: sessionStorage.getItem('userId'),
			name: this.props.name
		}
	}

	componentDidMount() {
		this.setState({name: this.props.name});
		console.log(this.state)
	}

	render() {
		
		const userId = this.state.isLoggedIn;
		sessionStorage.setItem('userId', userId)
		if (userId) {
			return (
				<div>
					
					<NavBar />
					<p></p>
					<CCAccount/>
					<p></p>
					<LogoutButton/>
					

				</div>
			)
		} else {
			return ( 
			<div> 
				You are not logged in.
				<Redirect to="/"/>
			</div>
			)
		}
	}
}


class NavBar extends React.Component {
	constructor(props) {
		super(props);
	}
			
	render() {
		const userId = sessionStorage.getItem('userId')
		if (userId) {
		return (
				<div>
					<Router>
						<Link to="dashboard">Dashboard</Link>
						<br></br>
						<Link to="/add-new">Track a New Card</Link>
						<br></br>
						<Link to="/myprofile">My Profile</Link>
						<br></br>

						<Route exact path="/dashboard">
								<Dashboard exact path="/dashboard"/>
						</Route>
						<Route exact path="/add-new">
							<TrackNewAccount exact path="/add-new"/>
						</Route>
						<Route exact path="/myprofile">
							<UserProfile exact path="/myprofile" />
						</Route>
					</Router>
				</div> 
			)	
		} else {
			return (
				<div> 
					<p>You are not logged in. Please log in.</p>
					<Link to="/"> Back to Login </Link>
				</div>
		)}
	}
}



class LogoutButton extends React.Component {
	constructor(props) {
		super(props);

		sessionStorage.removeItem('user_id');
		this.clearSession = this.clearSession.bind(this);
	}

	clearSession() {
		event.preventDefault();
		fetch("api/clear-session", {
		method: 'POST'
		})
		.then(response => response.json())
		.then(sessionStorage.clear());	
	}

	render() {
		return (
			<div>
				<button 
					type="submit" 
					name="logout" 
					onClick={this.clearSession}>
					Log out
					</button>
			</div>
		)
	}
}


class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			userId: '',
			name: '',
			isLoggedIn: false
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.getEmail = this.getEmail.bind(this);
		this.getPassword = this.getPassword.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const data = {
			email: this.state.email,
			password: this.state.password
		};
		
			fetch('/api/login', {
			method: 'POST',
			body: JSON.stringify(data),
		})
		.then(response => response.json())
		// .then(data => console.log(data))
		.then(data => {
			if ('error' in data) {
				alert(data['error']);
				console.log(data)
			} else {
				this.setState({
					userId: data[0],
					name: data[1],
					email: data[2],
					isLoggedIn: true
				});
				sessionStorage.setItem('userId', data[0]);
				sessionStorage.setItem('name', data[1]);
				sessionStorage.setItem('email', data[2]);
				console.log(this.state);
				this.props.userLoggedIn(data[0], data [1], data[2])}
			})
		}

	getEmail(event) {
		event.preventDefault();
		this.setState({email: event.target.value});
	}
	
	getPassword(event) {
		event.preventDefault();
		this.setState({password: event.target.value});
	}

	render() {
		if(this.state.name) {
			return (
				<div>
					<h3>Welcome {this.state.name}!</h3>
				</div>
			)
		}

		return (
			<div>
				<div className="form">
				<Link className="link" to="/register" > Sign up for an account </Link>
				<p></p>
					<form id="LoginForm" onSubmit={this.handleSubmit}>
					<div className="form-group col-md-6">
						<label htmlFor="email">
							Email:
							<br></br>
							<input className="form-control" name="email" type="email" onChange = {this.getEmail} ref={this.input} value={this.state.email} />
						</label>
						<br></br>
						<label className="form-check-label" htmlFor="password">
							Password:
							<br></br>
							<input className="form-group" name="password" type="password" onChange = {this.getPassword} ref={this.input} value={this.state.password}/>
						</label>
						<br></br>
						<button className="btn btn-primary" id="button" type="submit">Login!</button>
					</div>
				</form>
				</div>
			</div>
				)
			}
		}

	
class Registration extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			firstname: '',
			lastname: '',
			email: '',
			password: ''
		};

		this.handleSubmit = this.handleSubmit.bind(this);
		this.getFName = this.getFName.bind(this);
		this.getLName = this.getLName.bind(this);
		this.getEmail = this.getEmail.bind(this);
		this.getPassword = this.getPassword.bind(this);
	}

	handleSubmit(event) {
		event.preventDefault();
		const data = {
			firstname: this.state.firstname,
			lastname: this.state.lastname,
			email: this.state.email,
			password: this.state.password
		}
		console.log(data)

		fetch('/api/registration', {
			method: 'POST',
			body: JSON.stringify(data),
		})
		.then(response => response.json())
		.then(data => alert(data));												
		}

	getFName(event) {
		event.preventDefault();
		this.setState({firstname: event.target.value});
		console.log(event.target.value)
	}

	getLName(event) {
		event.preventDefault();
		this.setState({lastname: event.target.value})
	}

	getEmail(event) {
		event.preventDefault();
		this.setState({email: event.target.value})
	}
	
	getPassword(event) {
		event.preventDefault();
		this.setState({password: event.target.value})
	}
	
		render() {
			return (
				<div>
					<Link className="link" to="/">Back to Login</Link>
					<div className="form"> 
					<form onSubmit={this.handleSubmit}>
						<p>New User? Register Here.</p>
							<label htmlFor="firstname">
								First name:
								<input className="form-group" name="firstname" type="text" ref={this.input} onChange = {this.getFName} value={this.state.firstname}/>
							</label>
							<label htmlFor="lastname">
								Last name:
								<input className="form-group" name="lastname" type="text" ref={this.input} onChange={this.getLName} value={this.state.lastname}/>
							</label>
							<label htmlFor="email">
								Email address:
								<input className="form-group" name="email" type="text" ref={this.input} onChange={this.getEmail} value={this.state.email}/>
							<label htmlFor="password">
								Password:
									<input className="form-group" name="password" type="text" ref={this.input} onChange={this.getPassword} value={this.state.value}/>
							</label>
							<button className="btn btn-primary" type="submit">Register Me!</button>
							</label>
						</form>
						</div>
					</div>
				)
			}
		}


class CCAccount extends React.Component {
	
	constructor(props) {
		super(props)
		this.state = {
			userId: '',
			name: '',
			isLoggedin: sessionStorage.getItem('userId'),
			ccAcctInfo: [],
			ccInfo: [],
			spentAmt: '',
		}
		this.showAcctCC = this.showAcctCC.bind(this);
		this.showAcctForm = this. showAcctForm.bind(this);
		this.showLoyaltyPortal = this.showLoyaltyPortal.bind(this);
		}

	componentDidMount() {

		const acctData = this.props.isLoggedIn;
		fetch('/api/cc-accounts', {
			method: 'POST',
			body: JSON.stringify(acctData)
			}
		)
		.then(response => response.json())
		.then(data => {
			if (typeof data == 'string') {
				alert(data)
			} else {
				this.setState({ccAcctInfo: data});
				// console.log(this.state.ccAcctInfo)
			}
		})
		.then( () => fetch('api/cc-info', {method: 'POST'}))
		.then(response => response.json())
		.then(data => {
			this.setState({ccInfo: data});
			console.log(this.state.ccInfo);
			console.log(this.state.ccAcctInfo);
		})
		.then( () => fetch('api/loyalty-info', {method: 'POST'}))
		.then(response => response.json())
		.then(data => {
			this.setState({loyalty: data});
			console.log(this.state.loyalty)
		})
	}

	showAcctCC() {
		const accountList = []
		// console.log(this.state.ccInfo);
		for (let card of this.state.ccInfo) {
			accountList.push(
				<CCInfo
				imagePath={card.cc_img}
				name={card.cc_name}
				bank-id={card.bank_id}
				loyalty={card.loyalty_program_id}
				card={card} //this allows passing of the card as a single array instead of as a list of dicts
				/>
			);
		}
		return accountList
	}

	showAcctForm() {
		const allCCs = []
		// console.log(this.state.ccInfo)
		for (let i = 0; i < this.state.ccAcctInfo.length; i++) {
			allCCs.push(
				<SpendingForm acct={this.state.ccAcctInfo[i]} card={this.state.ccInfo[i]} />  //use a for loop here with i because both arrays will always coincide at index
			)
		}
		return allCCs
	}

	showLoyaltyPortal() {
		console.log(this.state.loyalty);
		const loyaltyPortal = []
		for (let card of this.state.ccInfo)
			{loyaltyPortal.push(
				<LoyaltyPortal lpID={card.loyalty_program} lpPrograms={this.state.loyalty} />
			)
		}
		return loyaltyPortal
	}

	render() {
				return (
				<div>
					<div>
						{this.showAcctCC()}
					</div>
					<div>
						{this.showAcctForm()}
					</div>	
					<div>
						{this.showLoyaltyPortal()}
					</div>
				</div>
			)}
	}


class CCInfo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	componentDidMount(){
		if (this.props.bank_id == 1) {
			this.setState({bank: "Chase Bank"})
		} else {
			this.setState({bank: "American Express"})
		}
	}

	render() {
		return (
			<div>
				<span>
					<h4>
						Your {this.state.bank} {this.props.name} ending in *0804
					</h4>
					</span>
				<img width="250" height="167" id="credit-card-image" 
				src={this.props.imagePath}
				onClick={this.props.onClick}/>
			</div>
		)
	}
}

class SpendingForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			spentAmt: '',
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.getAmt = this.getAmt.bind(this);
		this.calculateSpending = this.calculateSpending.bind(this);
	}

	getAmt(event) {
		this.setState({spentAmt: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault()
		console.log(this.state.spentAmt)
		let reqdSpend = this.props.card.req_spending;
		let remainingSpend = reqdSpend - this.state.spentAmt;
		this.setState({toSpend: remainingSpend})
		console.log(remainingSpend)
	} //access info through props directly, not state

	calculateSpending() {
		const months = [ "January", "February", "March", "April", "May", "June", 
		"July", "August", "September", "October", "November", "December", "January", "February", "March", "April" ]

		// for(let card of this.state.ccAcctInfo)
		// {
		let deadline;
		let timeframe = this.props.card.spend_timeframe
		console.log(timeframe)
		let date = new Date(this.props.acct.approval_date) //instantiates Date object
		console.log(date)
		let month = date.getMonth() //gets month of date
		console.log(month)
		
		let newDate = timeframe + month  //gets month for spending deadline
		console.log(newDate)
		deadline = (months[newDate] + " " + date.getDate() + ", " + 2020) //date.getFullYear());
		console.log(deadline)
		this.setState({ccDeadline: deadline});
		console.log(this.state.ccDeadline)
		}

render() {
	console.log(this.props)  //not put on state, bc undefined on first render, the rerender 
	return (
		<div>
			<span>
				<form id="SpendingForm" onSubmit={this.handleSubmit}>
					<label htmlFor="spendingAmount">
					How much have you spent on this card to date?  $
					<input name="spending-form" type="text" onChange={this.getAmt} value={this.state.spentAmt} />
					<button name="submit" onClick={this.calculateSpending}>Submit</button>
					</label>
				</form>
				To get your credit card spending bonus, you must spend ${this.state.toSpend} by {this.state.ccDeadline}.
			</span>
		</div>

	)
}
}

class LoyaltyPortal extends React.Component {
	constructor(props) {
		console.log(props)
		super(props);
	}

	render() {
		return (
			<div>
				<a href={this.props.loyalty_program}>
					Visit British Airways Avios portal
				</a> 
			</div>
		)
	}
}


class UserProfile extends React.Component {
constructor(props) {
	super(props)
	this.state = {
		currentPW: '',
		newPW: '',
		isLoggedIn: this.props.isLoggedIn
	}

	this.getNewPassword = this.getNewPassword.bind(this);
	this.getCurrentPassword = this.getCurrentPassword.bind(this);
	this.handleSubmit = this.handleSubmit.bind(this);
	}

	getCurrentPassword(event) {
		event.preventDefault();
		this.setState({currentPW: event.target.value});
		// console.log(this.state)
	}	
			 
	getNewPassword(event) {
		event.preventDefault();
		this.setState({newPW: event.target.value});
		// console.log(this.state.newPW)
	}

	handleSubmit(event) {
		event.preventDefault();
		
		let data = [sessionStorage.getItem('userId'), this.state.currentPW, this.state.newPW] 
		
		fetch('api/update-password', {
			method: 'POST',
			body: JSON.stringify(data)
		})
	
		.then(response => response.json())
		// .then(data => console.log(data))
		.then(data => {
			if ('error' in data) {
				alert("Your current password is not correct. Please try again." )
			} else {
				alert("Your password has been updated.")
			}
		})
	}

	render() {
		return(
			<div>
				<h4>My Profile</h4>
					<p>Name: {sessionStorage.getItem('name')}</p>
					<p>Email: {sessionStorage.getItem('email')}</p>
					<p>Your profile settings are current.</p>
					<p>If you'd like to  change your password, enter the new password below. </p>
				<form id="current-password" onSubmit={this.handleSubmit}>
					<label htmlFor="current-password">
						Current password:
						<input name="current-password" type="text" onChange = {this.getCurrentPassword} ref={this.input} value={this.state.currentPW} />
					</label>
					<label htmlFor="new-password">
						New password:
						<input name="new-password" type="text" onChange = {this.getNewPassword} ref={this.input} value={this.state.newPW} />
					</label>
					<button>Save new</button>
					</form>
				<p></p>
			</div>
			)
		}
	}


class TrackNewAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			creditCards: [],
			cardClicked: '',
			isLoggedin: this.props.isLoggedIn
		}
		this.renderCC = this.renderCC.bind(this);
		this.cardClick = this.cardClick.bind(this);
		this.showForm = this.showForm.bind(this);
	}

	componentDidMount() {
		fetch('api/get-cards')
		.then(response => response.json())
		.then(
			(result) => {
				this.setState({
					creditCards: result})
				});
			}

	renderCC() {
		const creditCardsList = []
		console.log(this.state)
		for (let card of this.state.creditCards) 
		{creditCardsList.push(
				<CCImage 
					imagePath={card.cc_img} 
					ccid={card.cc_id} 
					ccname={card.cc_name} 
					loyalty={card.loyalty_program_id} 
					onClick={() => {this.cardClick(card.cc_id)}}  
					/>
			);
		}
		return creditCardsList 
	}

	cardClick(ccid) {
		this.setState({cardClicked: ccid});  // also could use getAttribute() here instead
	console.log(this.state.cardClicked);
	}

	showForm() {
	console.log(this.state.cardClicked);
	if (typeof this.state.cardClicked === 'number') {
		return (
			<div>
				<CCForm cardClicked={this.state.cardClicked}/> 
			</div>
		)}
	}
	
	render() {
		console.log(this.state.cardClicked);
		const creditCards = this.state.creditCards  //a list of dictionaries per card

		if (creditCards.length < 6) {
			return (
			<div>"Credit cards now loading..."</div>)
		} else {
			return (
			<div>
				<h3>To track a credit card and add it to your account, select a specific card below.</h3>

				<div>
					{this.showForm()}	
				</div>
				<br></br>
				<br></br>
				<div>
					{this.renderCC()}
				</div>
			</div>
			)}
		}
	}



class CCImage extends React.Component {
	constructor(props) {
		super(props);
		console.log(props)
	}

	render() {
		return (
				<img width="250" height="167" 
				src={this.props.imagePath} 	
				ccid={this.props.ccid} 
				ccname={this.props.ccname} 
				loyalty={this.props.loyalty}
				onClick={this.props.onClick} />
		)
	}
}


class CCForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			approvalDate: '',
			clientStatus: '',
			last_owned: '',
			cardClicked: this.props.cardClicked
		}
		this.getApprovalDate = this.getApprovalDate.bind(this);
		this.getClientStatus = this.getClientStatus.bind(this);
		this.addCCAcct = this.addCCAcct.bind(this);
		this.previousOwner = this.previousOwner.bind(this);
	}

	getApprovalDate(event) {
		this.setState({approvalDate: event.target.value})
		console.log(this.state)
	}

	getClientStatus(event) {
		this.setState({clientStatus: event.target.value});
		console.log(this.state)
	}

	previousOwner(event) {
		this.setState({last_owned: event.target.value});
		console.log(this.state)
	}

	addCCAcct() {
		const data = {
			date_opened: this.state.approvalDate,
			last_owned: this.state.last_owned,
			credit_card_id: this.state.cardClicked
		};
		
		fetch('/api/add-card', {
			method: 'POST',
			body: JSON.stringify(data)
		})
		.then(response => response.json())
		.then(data => alert(data))
	}

	render() {
		if (this.state.clientStatus === "previous owner") {
			return (
				<div>
					<label forHTML="last-owned">When did you last own this card?</label>
					<input type="date" id="last-owned" name="last-owned" onChange={this.previousOwner} value={this.state.last_owned} ref={this.input} />
					<p></p>
					<button id="submit" onClick={this.addCCAcct}> Add card</button>
				</div>
				)
			}

		return (
			<div>
				<h3>Please enter the following information about your new {this.state.ccBank} {this.state.ccName} </h3>
				<form>
					<label htmlFor="approval-date">
						When was your card application approved?
					</label>
					<input type="date" id="approval-date" name="approval-date" onChange={this.getApprovalDate} value={this.state.approvalDate} ref={this.input} />
						<p></p>
					<label htmlFor="client-status">Check here if you have previously owned this card.</label>
						<input type="checkbox" id="client-status" value="previous owner" onChange={this.getClientStatus} checked={this.state.clientStatus} ref={this.input}/>
						<p></p>
					<button id="submit" onClick={this.addCCAcct}> Add card</button>
				</form>
			</div>
		)
	}
}



ReactDOM.render (
		<App />,
	document.getElementById("root")
);
