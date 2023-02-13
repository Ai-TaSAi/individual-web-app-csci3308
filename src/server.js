/***********************
  Load Components!

  Express      - A Node.js Framework
  Body-Parser  - A tool to help use parse the data in a post request
  Pg-Promise   - A database tool to help use connect to our PostgreSQL database
***********************/
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.
		We'll be using `db` as this is the name of the postgres container in our
		docker-compose.yml file. Docker will translate this into the actual ip of the
		container for us (i.e. can't be access via the Internet).
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab,
		we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database. We set this in the
		docker-compose.yml for now, usually that'd be in a seperate file so you're not pushing your credentials to GitHub :).
**********************/
const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


// login page
app.get('/', function(req, res) {
	res.render('pages/home',{
		my_title: "Home Page",
		color: '',
		color_msg: ''
	})
});

/*Add your other get/post request handlers below here: */

app.get('/home', function(req, res) {
	res.render('pages/home',{
		my_title: "Home Page",
		color: '',
		color_msg: ''
	})
});

app.get('/search_history', function(req, res) {
    var queryOne = 'SELECT * FROM search_history;';
    db.task('get-everything', task => {
        return task.batch([
            task.any(queryOne)
        ]);
    })
        .then(info => {

			// console.log(info[0]);

            res.render('pages/search_history',{
                my_title: "Search History",
                showsList: info[0]
            })
        })
        .catch(error => {
            req.flash('error', error);
            res.render('pages/search_history', {
                my_title: 'Search History',
                showsList: ""
            })
        });

});

app.post('/addToDB', function(req, res) {
    var title = req.body.title;
	var imgurl = req.body.imgURL;
    var rating = req.body.rating;
    var summary = req.body.summary;
	var genre = req.body.genre;
	var weburl = req.body.linkURL;

	title = title.replace(/'/g, "''");
	summary = summary.replace(/'/g, "''");

	console.log("GENRE ARRAY: " + genre);

	var genreHotFix = "";

	if(genre) {
		genreHotFix = "[";
		for (var i = 0; i < genre.length - 1; i++) {
			genreHotFix += "'" + genre[i] + "',";
		}
		genreHotFix += "'" + genre[genre.length - 1] + "']";
	} else {
		genreHotFix = "[]::TEXT[]";
	}

	console.log("================== CHECK ==================");
	console.log("TITLE: " + title);
	console.log("IMGURL: " + imgurl);
	console.log("RATING: " + rating);
	console.log("GENRE: " + genreHotFix);
	console.log("WEBURL: " + weburl);
	console.log("===========================================");

    var insert_statement = `INSERT INTO search_history(show_name, img_link, rating, show_summary, genres, link_to) VALUES ('${title}', '${imgurl}', ${rating}, '${summary}', ARRAY ${genreHotFix}, '${weburl}');`;

	console.log(insert_statement);

    db.task('post-data', task => {
        return task.batch([
           task.any(insert_statement) 
        ]);
    })
    .then(results => {
        res.status(200).send();
    })
    .catch(err => {
        console.log("Error: " + err);
        res.status(400).send();
    });
});


//app.listen(3000);
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Express running → PORT ${server.address().port}`);
});