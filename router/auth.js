
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const cookieParser = require("cookie-parser");
const authenticate = require("../middleware/authenticate");

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

router.use(cookieParser());


const User = require("../model/userSchema");



const Electionname = require("../model/electionNameSchema");
const ConstitutionBangla = require("../model/constitutionbanglaschema");
const ConstitutionEnglish = require("../model/constitutionenglishschema");
const CandidateBangla = require("../model/candidateBanglaSchema");
const CandidateEnglish = require("../model/candidateEnglishSchema");
const CandidateForBangla = require("../model/candidateForBanglaSchema");
const Data = require("../model/dataSchema");

router.get('/', (req, res) => {
	res.send('Hello world from the server router js');
});



// login route

router.post('/signin', async (req, res) => {
	
	try {
		let token;
		const { email, password } = req.body;
		
		if (!email || !password) {
			return res.status(400).json({ error: "please filled the data" })
		}
		const userLogin = await User.findOne({ email: email });

		if (userLogin) {
			const isMatch = await bcrypt.compare(password, userLogin.password);

			if (!isMatch) {
				res.status(400).json({ error: "invalid credentials password " });
			} else {
				token = await userLogin.generateAuthToken();
				
				res.cookie("jwtoken", token, {
					expires: new Date(Date.now() + 25892000000),
					httpOnly: true
				});
				res.json({ message: "user signin successfully with auth" })
			}
		} else {
			res.status(400).json({ error: "invalid credientials " });
		}

	} catch (err) {
		console.log(err)
	}

});

// about us

router.get('/about', authenticate, (req, res) => {
	//router.get('/about', (req,res) => {
	console.log(`about us`);
	res.cookie("test", "bangladesh")
	//res.send(`about us from the server`);
	res.send(req.rootUser)
});

// get user data for contact us and home page

router.get('/getdata', authenticate, (req, res) => {
	//router.get('/getdata', (req,res) => {
	console.log(`get data`);
	//res.send(`get data from the server`);
	res.send(req.rootUser)
});






// contact us page

router.post('/contact', authenticate, async (req, res) => {
	//router.post('/contact', async(req,res) => {
	console.log(`contact us`);
	try {
		const { name, email, message } = req.body;

		console.log(name + ' ' + email + ' ' + message)

		if (!name || !email || !message) {
			console.log("error");
			return res.json({ error: "please filled the contact form" })
		}


		const userContact = await User.findOne({ _id: req.userID });

		console.log('userContact')
		console.log(userContact)

		if (userContact) {
			const userMessage = await userContact.addMessage(name, email, message);
			await userContact.save();
			res.status(201).json({ message: "user contact successfully" })
		}

	} catch (error) {
		console.log(error)
	}
});








// Create a route to retrieve data from MongoDB , getconstitutiondata for constitution page
router.get('/getconstforcandibangladata', async (req, res) => {
	try {
		const dataWithArray = await ConstitutionBangla.find().toArray();
		const options = {};
		dataWithArray.forEach(item => {
			options[item.electionid] = item.banglaconstitutionname;
		});
		res.send(options);
	} catch (err) {
		console.error(err);
		res.status(500).send('Internal server error');
	}
});


router.get("/mergeCollections", async (req, res) => {
	try {
		const mergedData = await ConstitutionBangla.aggregate([
			{
				$lookup: {
					from: "CandidateBangla", // Collection to merge with
					localField: "electionid", // Field from ConstitutionBangla
					foreignField: "electionid", // Field from CandidateBangla
					as: "candidates" // Field name to store the merged data
				}
			}
		]);

		res.status(200).json(mergedData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});


// Create a route to retrieve data from MongoDB , getelectiondata for election page
router.get('/getelectiondata', async (req, res) => {
	const data = await Electionname.find({});
	res.send(data);
});

// Create a route to retrieve data from MongoDB , getconstitutiondata for constitution page
router.get('/getconstforcandidatebangladata', async (req, res) => {
	const data = await ConstitutionBangla.find({});
	res.send(data);
});


// Create a route to retrieve data from MongoDB , getconstitutiondata for constitution page
router.get('/getconstbangladata', async (req, res) => {
	const data = await ConstitutionBangla.find({});
	res.send(data);
	//res.send([data, options]);
});


// Create a route to retrieve data from MongoDB , getcandidatedata for candidate page
router.get('/getcandidatebangladata', async (req, res) => {
	const data = await CandidateBangla.find({});
	res.send(data);
});


router.get("/candidatedataedit/:candidateid", async (req, res) => {
	try {

		const candidateid = req.params.candidateid;
		console.log("candidateid")
		console.log(req.params.candidateid)

		const candidateindividualdata = await CandidateBangla.find({ candidateid: candidateid });

		console.log("candidateid")
		console.log(candidateindividualdata)
		res.send(candidateindividualdata);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

router.get("/candidateedit/:electionid", async (req, res) => {
	try {

		const electionid = req.params.electionid;
		console.log("electionid")
		console.log(req.params.electionid)

		const candidateindividualdata = await CandidateBangla.find({ electionid: electionid });

		//console.log("candidateid")
		//console.log(candidateindividualdata)
		res.send(candidateindividualdata);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});



router.get("/searchbyelectionid/:electionid", async (req, res) => {
	try {

		const electionid = req.params.electionid;
		console.log("electionid")
		console.log(req.params.electionid)

		const candidateindividualdata = await CandidateBangla.find({ electionid: electionid });

		//console.log("candidateid")
		//console.log(candidateindividualdata)
		res.send(candidateindividualdata);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});


router.get("/constitutiondataedit/:constitutionid", async (req, res) => {
	try {

		const constitutionid = req.params.constitutionid;
		console.log("constitutionid")
		console.log(req.params.constitutionid)

		const constitutionindividualdata = await ConstitutionBangla.find({ constitutionid: constitutionid });

		console.log("constitutionid")
		console.log(constitutionindividualdata)
		res.send(constitutionindividualdata);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

//  this router is using multidimensional component
router.get("/dimensional/:electionid", async (req, res) => {
	try {

		const electionid = req.params.electionid;
		console.log("electionid")
		console.log(req.params.electionid)

		const candidateindividualdata = await CandidateBangla.find({ electionid: electionid });

		//console.log("candidateid")
		//console.log(candidateindividualdata)
		res.send(candidateindividualdata);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

//  this router is using dimensional component

router.get("/dimensional2api/:electionid", async (req, res) => {
	try {

		const electionid = req.params.electionid;
		console.log("electionid")
		console.log(req.params.electionid)

		const electiondata = await Electionname.find({ electionid: electionid });
		const candidateindividualdata = await CandidateBangla.find({ electionid: electionid });
		const constitutions = await ConstitutionBangla.find({ electionid: electionid });
		console.log("electiondata")
		console.log(electiondata)
		//res.send(candidateindividualdata);

		const responseData = {
			electiondata: electiondata,
			candidateindividualdata: candidateindividualdata,
			constitutions: constitutions
		};

		console.log("responseData")
		console.log(responseData)

		res.send(responseData);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});



// read the constitution by election value is using multidimensional component

router.get("/constitutiondimension/:electionid", async (req, res) => {
	try {
		const electionid = req.params.electionid;
		console.log("electionid")
		console.log(req.params.electionid)
		const constitutions = await ConstitutionBangla.find({ electionid: electionid });

		res.json(constitutions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// read the election value

router.get("/constitution/:electionid", async (req, res) => {
	try {
		const electionid = req.params.electionid;
		const constitutions = await ConstitutionBangla.find({
			electionid: electionid,
		});

		res.json(constitutions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});


router.get('/constitutionelection', async (req, res) => {
	const electionId = req.query.electionid;
	console.log('electionId');
	console.log(electionId);

	try {
		const constitutionData = await ConstitutionBangla.findOne({ electionid: electionId }).exec();

		if (!constitutionData) {
			return res.status(404).json({ message: 'Constitution data not found' });
		}

		res.status(200).json(constitutionData);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: 'Server error' });
	}
});








// Create a route to retrieve data from MongoDB , getconstitutiondata for constitution page
router.get('/getconstenglishdata', async (req, res) => {
	const data = await ConstitutionEnglish.find({});
	res.send(data);
});

//  add Election name

router.post('/addelectionname', async (req, res) => {

	console.log(`addelectionname`);
	console.log(req.body)
	try {
		const { banglaelectionname, englishelectionname, statusfordisplay } = req.body;

		console.log(banglaelectionname + ' ' + englishelectionname + ' ' + statusfordisplay)

		if (!banglaelectionname || !englishelectionname || !statusfordisplay) {
			console.log("error");
			return res.json({ error: "please filled the Election name" })
		}


		const electionname = await Electionname.findOne({ banglaelectionname: req.banglaelectionname });

		console.log('electionname')
		console.log(electionname)

		const electionNameExist = await Electionname.findOne({ banglaelectionname: banglaelectionname });

		if (electionNameExist) {
			return res.status(422).json({ error: " electionNameExist Already Exist " });
		}

		console.log('electionNameExist');

		const electionnameinsert = new Electionname({ banglaelectionname, englishelectionname, statusfordisplay });
		console.log('electionnameinsert');
		console.log(electionnameinsert);
		// save method
		await electionnameinsert.save();
		res.status(201).json({ message: "value inserted successfully" })
	} catch (error) {
		console.log(error)
	}
});



//  add constitution name

router.post('/addconstitutionname', async (req, res) => {

	console.log(`addconstitutionname`);
	console.log(req.body)
	try {
		const { electionid, banglaelectionname, englishelectionname, statusfordisplay } = req.body;

		console.log(electionid + ' ' + banglaelectionname + ' ' + englishelectionname + ' ' + statusfordisplay)

		if (!electionid || !banglaelectionname || !englishelectionname || !statusfordisplay) {
			console.log("error");
			return res.json({ error: "please filled the Election name" })
		}


		const electionname = await Electionname.findOne({ banglaelectionname: req.banglaelectionname });

		console.log('electionname')
		console.log(electionname)

		const electionNameExist = await Electionname.findOne({ banglaelectionname: banglaelectionname });

		if (electionNameExist) {
			return res.status(422).json({ error: " electionNameExist Already Exist " });
		}

		console.log('electionNameExist');

		const electionnameinsert = new Electionname({ electionid, banglaelectionname, englishelectionname, statusfordisplay });
		console.log('electionnameinsert');
		console.log(electionnameinsert);
		// save method
		await electionnameinsert.save();
		res.status(201).json({ message: "value inserted successfully" })
	} catch (error) {
		console.log(error)
	}
});

//  add constitution bangla name

router.post('/constitutionbangla', async (req, res) => {

	console.log(`addconstitutionbangla`);
	console.log(req.body)
	try {
		const { electionid, constitutionid, banglaconstitutionname, totalcenter, obtainedcenter, sortingorder, date } = req.body;

		console.log(electionid + ' ' + constitutionid + ' ' + banglaconstitutionname + ' ' + totalcenter + ' ' + obtainedcenter + ' ' + sortingorder + ' ' + date)

		if (!constitutionid || !banglaconstitutionname) {
			console.log("error");
			return res.json({ error: "please filled the constitution name" })
		}


		const constitutionbanglainsert = new ConstitutionBangla({ electionid, constitutionid, banglaconstitutionname, totalcenter, obtainedcenter, sortingorder, date });
		console.log('constitutionbanglainsert');
		console.log(constitutionbanglainsert);
		// save method
		await constitutionbanglainsert.save();
		res.status(201).json({ message: "value inserted successfully" })
	} catch (error) {
		console.log(error)
	}
});


//  add constitution english name

router.post('/constitutionenglish', async (req, res) => {

	console.log(`addconstitutionenglish`);
	console.log(req.body)
	try {
		const { constitutionid, englishconstitutionname, totalcenter, obtainedcenter, sortorder, date } = req.body;

		console.log(constitutionid + ' ' + englishconstitutionname + ' ')

		if (!constitutionid || !englishconstitutionname) {
			console.log("error");
			return res.json({ error: "please filled the constitution name" })
		}


		const constitutionname = await ConstitutionEnglish.findOne({ englishconstitutionname: req.englishconstitutionname });

		console.log('constitutionname')
		console.log(constitutionname)

		const constitutionNameExist = await ConstitutionEnglish.findOne({ englishconstitutionname: englishconstitutionname });

		if (constitutionNameExist) {
			return res.status(422).json({ error: " constitutionNameExist Already Exist " });
		}

		console.log('constitutionNameExist');

		const constitutionenglishinsert = new ConstitutionEnglish({ constitutionid, englishconstitutionname, totalcenter, obtainedcenter, sortorder, date });
		console.log('constitutionenglishinsert');
		console.log(constitutionenglishinsert);
		// save method
		await constitutionenglishinsert.save();
		res.status(201).json({ message: "value inserted successfully" })
	} catch (error) {
		console.log(error)
	}
});

//  add candidate bangla name

router.put('/candidatebangla', async (req, res) => {

	console.log('candidateforbangla backend');
	console.log(req.body)
	console.log('-------------------------------')
	console.log('candidateforbangla backend');

});





//  add candidate bangla name

router.post('/candidatebangla', async (req, res) => {


	try {
		const { electionid, constitutionid, candidateid, candidatenamebangla, partysymbol, totalvote, date } = req.body;

		console.log('candidatebangla')
		console.log(req.body)

		console.log(electionid + ' ' + constitutionid + ' ' + candidateid + ' ' + candidatenamebangla + ' ' + partysymbol + ' ' + totalvote)

		if (!electionid || !candidatenamebangla) {
			console.log("error");
			return res.json({ error: "please filled the candidate form" })
		}

		const candidatebanglainsert = new CandidateBangla({ electionid, constitutionid, candidateid, candidatenamebangla, partysymbol, totalvote, date });
		console.log('candidatebanglainsert');
		console.log(candidatebanglainsert);
		console.log(electionid + ' ' + constitutionid + ' ' + candidateid + ' ' + candidatenamebangla + ' ' + totalvote + ' ' + partysymbol)
		// save method
		await candidatebanglainsert.save();
		res.status(201).json({ message: "value inserted successfully" })
	} catch (error) {
		console.log(error)
	}
});


router.post('/candidate/:upid', async (req, res) => {
	try {

		const upid = req.params.upid;
		console.log('candidateparams')
		console.log(req.params)
		const { id, electionid, constitutionid, candidateid, candidatenamebangla, partysymbol, totalvote, date } = req.body;
		console.log(id + ' ' + electionid + ' ' + constitutionid + ' ' + candidateid + ' ' + candidatenamebangla + ' ')
		const candidatesearch = await CandidateBangla.findOne({ candidateid: upid });
		console.log('candidatesearch')
		console.log(candidatesearch)
		const candidate = await CandidateBangla.updateOne({ _id: id }, req.body);
		console.log('req.body')
		console.log(req.body)

		console.log('candidate')
		console.log(candidate)
		res.status(201).json({ message: "value updated successfully" })
	} catch (err) {
		console.error(err);
		res.status(500).json({ success: false, error: 'Server Error' });
	}
});


//  add candidate english name

router.post('/candidateenglish', async (req, res) => {

	console.log(`candidateenglish`);
	console.log(req.body)
	try {


		const { electionid, constitutionid, candidateid, candidatenameenglish, partysymbol, totalvote, date } = req.body;

		console.log(electionid + ' ' + constitutionid + ' ' + candidateid + ' ' + candidatenameenglish + ' ')

		if (!constitutionid || !candidatenameenglish) {
			console.log("error");
			return res.json({ error: "please filled the candidate form" })
		}


		const candidateenglish = await CandidateEnglish.findOne({ candidatenameenglish: req.candidatenameenglish });

		console.log('candidateenglish')
		console.log(candidateenglish)

		const candidateNameExist = await CandidateEnglish.findOne({ candidatenameenglish: candidatenameenglish });

		if (candidateNameExist) {
			return res.status(422).json({ error: " candidateName Already Exist " });
		}

		console.log('candidateNameExist');

		const candidateenglishinsert = new CandidateEnglish({ electionid, constitutionid, candidateid, candidatenameenglish, partysymbol, totalvote, date });
		console.log('candidateenglishinsert');
		console.log(candidateenglishinsert);
		// save method
		await candidateenglishinsert.save();
		res.status(201).json({ message: "value inserted successfully" })
	} catch (error) {
		console.log(error)
	}
});



router.post('/selecttemplateec', async (req, res) => {
	console.log('selecttemplateec');
})

// Logout page

router.get('/logout', (req, res) => {
	console.log(`logout page`);
	res.clearCookie('jwtoken', { path: '/' })
	res.status(200).send('user Login');
})




module.exports = router;
