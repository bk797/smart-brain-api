const {curry} = require('ramda');

const getLoginInfo = (db,email) => db('login').where({email}).select('hash','id','email');
const getUserByEmail = (db,email) => db('users').where({email:email}).select();

const signIn = (db,bcrypt,req,res) =>{
	const {email,pwd} = req.body;
	if(!(email&&pwd)){
		return res.status(400).json('invalid inputs');
	}
	getLoginInfo(db,email).then(data => {
		console.log('signin',data);
		if(data.length && bcrypt.compareSync(pwd,data[0].hash)){
			getUserByEmail(db,data[0].email).then(user=> res.json(user[0])).catch(console.log);
		} else {
			res.status(400).json('bad login info');
		}
	}).catch(err => res.status(400).json('error signing in'));
}

const handleSignIn = curry(signIn);

module.exports = {handleSignIn};