const express = require('express');

const ejs = require('ejs');
const pg = require('pg')
const path = require('path')
const session = require('express-session');
const fileUpload = require('express-fileupload')
const { Router } = require('express');
const imgur = require('imgur-uploader');
require('dotenv').config()


const client = new pg.Client(process.env.CONNECTION_STRING);

client.connect((error) => {
    if (error) console.error(error);
    else
        console.log("Connected");
});


const app = express();

app.set('view engine', 'ejs')

app.use(session({
    secret: process.env.APP_SECRET,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    resave: false,
}));

app.use(fileUpload());

const PORT = 3000

app.get('/', (req, res) => {
    try {
        let surname = "Sharma"
        // let surname = undefined
        // res.sendFile(__dirname + '/index.html');
        let friends = ["Dheeraj", "Sanket", "Sahil"]

        let usersData = [
            {
                name: "Lovely",
                age: 21,
                phone: "8766418907",
                salary: 87500.50
            },
            {
                name: "Dheeraj",
                age: 22,
                phone: "8766418900",
                salary: 97500.50
            },
            {
                name: "Dheeraj",
                age: 22,
                phone: "8766418900",
                salary: 97500.50
            },
            {
                name: "Dheeraj",
                age: 22,
                phone: "8766418900",
                salary: 97500.50
            },
            {
                name: "Dheeraj",
                age: 22,
                phone: "8766418900",
                salary: 97500.50
            }
        ]

        let htmlCode = `<h1>Heyy there, i am a heading!</h1>`;

        // let usersData = [user1, user2, user3, user4, user5]

        res.render('index', { surname: surname, friendsArray: friends, username: "Loveky", usersData: usersData, code: htmlCode })
    } catch (error) {
        console.error("Error in GET / route", error);
    }
})

app.get('/add', (req, res) => {
    try {
        res.send("Welcome aboard");
    } catch (error) {
        console.error("Error in GET /add route", error);
    }
})


app.get('/data', async (req, res) => {
    try {

        // Dependent queries, because 2nd query will only execute after the completion of first one.
        // Seial execution
        // const query1 = await client.query("SELECT * FROM AdminInfo")
        // const query2 = await client.query("SELECT * FROM BusInfo")



        const query1 = client.query("SELECT * FROM AdminInfo")
        const query2 = client.query("SELECT * FROM BusInfo")

        // Independent queries, executing parallely
        const [adminRows, busRows] = await Promise.all([query1, query2])
        // const { rows, rowCount } = error;
        console.log(busRows.rows, adminRows.rows);
        // console.log(rows[0].admin_full_name);
        // res.render('data', { adminRows: rows });

        res.send("Done");
    } catch (error) {

    }
})

app.get('/login', async (req, res) => {
    // Chck the login whether the login i successul or not
    // 1. Find the record for the current user in the db
    // 2. Match the saved and user entered password
    // 3. If passwords match, then save some important info about the user
    // Such as name, id, email, profile photo

    // if yes, save imp details about the logged user
    if (req.session.isLoggedIn) {
        // Redirect to home
        // res.send("You ar already logged in");
        res.redirect('/home')
    } else {
        req.session.name = "Lovely";
        req.session.isLoggedIn = true;
        res.send("Login succesfully");

    }
})

app.get('/home', (req, res) => {
    if (req.session.isLoggedIn) {
        console.log(req.session);
        let name = req.session.name;
        console.log("Logged user:" + name);
        res.send("Welcome" + name)
    } else {
        res.send("Kindly login")
    }
})


app.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (!error) {
            console.log("Logged out succesully");
            // res.send("Logged out succesully")
            res.redirect('/login')
        }
    })
})



app.route('/upload').
    get((req, res) => {

        res.render("upload")
    })
    .post(async (req, res) => {
        const uploadedImage = req.files.uploadedImage;
        console.log(req.files.uploadedImage);

        // imgur(uploadedImage.data).then(result => {
        //     console.log(result);

        //     // Insert operation should be performed here only
        //     let imageLink = result.link;
        //     console.log(imageLink);
        // }).catch(error => {
        //     console.log(error);
        // })


        const imageData = await imgur(uploadedImage.data);
        console.log(imageData);

        res.send("Done")
        // const uploadPath = path.join(__dirname, 'uploads', uploadedImage.name);
        // uploadedImage.mv(uploadPath, (err) => {
        //     if (err) {
        //         return res.status(500).send(err);
        //     }
        // });

        // res.send("File uploaded")
    })
    .put((req, res) => {

        res.send("Yayy PUT /upload")
    })
    .delete((req, res) => {
        res.send("DELETE")
    })


app.get('/student/:id', (req, res) => {
    let id = (req.params.id);

    res.send("Current param is: " + req.params.id);
})


app.post('/register', (req, res) => {
    console.log(req.body);
})
app.listen(PORT, (error) => {
    if (error) console.error(error);
    else console.log(`Server is running on port ${PORT}`);
})
