const {curry} = require('ramda');

const register = (db,bcrypt,req,res) => {
	const {email,name,pwd} = req.body;
	if(!(email&&name&&pwd)){
		return res.status(400).json('invalid inputs');
	}
	const hash = bcrypt.hashSync(pwd);
	db.transaction(trx => {
		trx.insert({email,hash}).into('login').returning('email')
		.then(loginEmail => trx('users').returning('*').insert({email,name,joined: new Date()}))
		.then(users => res.json(users[0]))
		.then(trx.commit)
		.catch(trx.rollback);
	})
	.catch(err => res.status(400).json('unable to register'));	
}

const handleRegister = curry(register);

module.exports = {handleRegister};