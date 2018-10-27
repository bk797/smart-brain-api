const {curry} = require('ramda');

const getUser = (id,db) => db('users').where({id}).select();

const profile = (db,req,res)=>{
	const id = Number(req.params.userid);
	getUser(id,db)
	.then(users => {
		if(users.length){
			res.json(users[0])			
		}
		else{
			res.status(400).json('user not found')
		}
	})
	.catch(err => res.status(400).json('error getting user'));
}

const handleProfile = curry(profile);

module.exports = {handleProfile};