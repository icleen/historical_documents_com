// Express Setup
const express = require('express');
const bodyParser = require("body-parser");
const morgan = require("morgan");
const crypto = require("crypto");
const multer = require("multer");
const path = require('path');
const formidable = require('formidable');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

// Knex Setup
const env = process.env.NODE_ENV || 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

// bcrypt setup
let bcrypt = require('bcrypt');
const saltRounds = 10;

// jwt setup
const jwt = require('jsonwebtoken');
let jwtSecret = process.env.jwtSecret;
if (jwtSecret === undefined) {
  console.log("You need to define a jwtSecret environment variable to continue.");
  knex.destroy();
  process.exit();
}

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token)
    return res.status(403).send({ error: 'No token provided.' });
  jwt.verify(token, jwtSecret, function(err, decoded) {
    if (err)
      return res.status(500).send({ error: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userID = decoded.id;
    next();
  });
}

// Image saving



// ------------------------ User Stuff ----------------------
app.post('/api/login', (req, res) => {
  if (!req.body.email || !req.body.password)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user === undefined) {
      res.status(403).send("Invalid credentials");
      throw new Error('abort');
    }
    return [bcrypt.compare(req.body.password, user.hash),user];
  }).spread((result,user) => {
    if (result) {
      let token = jwt.sign({ id: user.id }, jwtSecret, {
        expiresIn: 86400 // expires in 24 hours
      });
      res.status(200).json({user:{username:user.username,name:user.name,id:user.id},token:token});
    } else {
      res.status(403).send("Invalid credentials");
    }
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

app.post('/api/users', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.username || !req.body.name)
    return res.status(400).send();
  knex('users').where('email',req.body.email).first().then(user => {
    if (user !== undefined) {
      res.status(403).send("Email address already exists");
      throw new Error('abort');
    }
    return knex('users').where('username',req.body.username).first();
  }).then(user => {
    if (user !== undefined) {
      res.status(409).send("User name already exists");
      throw new Error('abort');
    }
    return bcrypt.hash(req.body.password, saltRounds);
  }).then(hash => {
    return knex('users').insert({email: req.body.email, hash: hash, username:req.body.username,
				 name:req.body.name, role: 'user'});
  }).then(ids => {
    return knex('users').where('id',ids[0]).first().select('username','name','id');
  }).then(user => {
    let token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).json({user:user,token:token});
    return;
  }).catch(error => {
    if (error.message !== 'abort') {
      console.log(error);
      res.status(500).json({ error });
    }
  });
});

// Get my account
app.get('/api/me', verifyToken, (req,res) => {
  knex('users').where('id',req.userID).first().select('username','name','id').then(user => {
    res.status(200).json({user:user});
  }).catch(error => {
    res.status(500).json({ error });
  });
});


// ------------------------ Document Stuff ----------------------
app.get('/api/users/:id/docs', (req, res) => {
  let id = parseInt(req.params.id);
  knex('users').join('documents','users.id','documents.user_id')
    .where('users.id',id)
    .orderBy('created','desc')
    .select('title','doctype','comments', 'filepath','username','name','created').then(documents => {
      res.status(200).json({documents:documents});
    }).catch(error => {
      res.status(500).json({ error });
    });
});

app.post('/api/users/:id/docs', verifyToken, (req, res) => {
  let id = parseInt(req.params.id);
  if (id !== req.userID) {
    res.status(403).send();
    return;
  }
  let filepath = '';
  let fields = [];

  // create an incoming form object
  let form = new formidable.IncomingForm();

  // specify that we don't want to allow the user to upload multiple files in a single request
  form.multiples = false;

  // store all uploads in the /static/uploadedfiles directory
  form.uploadDir = path.join(__dirname, '/static/uploadedfiles');

  // every time a file has been uploaded successfully,
  // rename it to it's orignal name
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
    // filepath = path.join(form.uploadDir, file.name);
    filepath = path.join('/static/uploadedfiles', file.name);
  });

  form.on('field', function(name, value) {
    fields.push(value);
  });

  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
    res.status(500).json({ error });
  });

  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    knex('users').where('id',id).first().then(user => {
      return knex('documents').insert({user_id: id, title:fields[0],
        doctype:fields[1], comments:fields[2],
        filepath:filepath,
        created: new Date()});
    }).then(ids => {
      return knex('documents').where('id',ids[0]).first();
    }).then(documents => {
      res.status(200).json({documents:documents});
      return;
    }).catch(error => {
      console.log(error);
      res.status(500).json({ error });
    }); // ---- end ----
  });

  // parse the incoming request containing the form data
  form.parse(req);

}); // ---- end ----

app.get('/api/docs/search', (req, res) => {
  if (!req.query.keywords)
    return res.status(400).send();
  let offset = 0;
  if (req.query.offset)
    offset = parseInt(req.query.offset);
  let limit = 50;
  if (req.query.limit)
    limit = parseInt(req.query.limit);
  knex('users').join('docs','users.id','docs.user_id')
    .whereRaw("MATCH (doctype) AGAINST('" + req.query.keywords + "')")
    .orderBy('created','desc')
    .limit(limit)
    .offset(offset)
    .select('title','doctype','comments','username','name','created','users.id as userID').then(documents => {
      res.status(200).json({documents:documents});
    }).catch(error => {
      res.status(500).json({ error });
    });
});


// ------------------------ Other User Stuff ----------------------
app.get('/api/users/:id', (req, res) => {
  let id = parseInt(req.params.id);
  // get user record
  knex('users').where('id',id).first().select('username','name','id').then(user => {
    res.status(200).json({user:user});
   }).catch(error => {
     res.status(500).json({ error });
   });
 });


app.listen(3000, () => console.log('Server listening on port 3000!'));
