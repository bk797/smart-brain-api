const {curry} = require('ramda');
const Clarifai = require('clarifai');

const {CLARIFAI_API_KEY} = process.env;

const app = new Clarifai.App({apiKey:CLARIFAI_API_KEY});

const getRegions = (url) => app.models.predict(Clarifai.FACE_DETECT_MODEL,url);

const incrementUser = (db,id) => db('users').where({id}).increment('entries',1).returning('entries');

const image = (db,req,res) =>{
	const id = Number(req.body.id);
	incrementUser(db,id)
	.then(entries => res.json({newEntries:entries[0]}))
	.catch(err=> {console.log(err); res.status(400).json('error adding entry')});
}

const handleImageAPI = (req,res) => {
	const {url} = req.body;
	getRegions(url)
	.then(api => res.json(api))
	.catch(err => res.status(400).json('error fetching api'));
}

const handleImage = curry(image);

module.exports = {handleImage,handleImageAPI};