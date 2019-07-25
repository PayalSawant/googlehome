var bodyParser = require('body-parser');
const to = require('await-to-js').default;
var express = require('express');
var request = require('request');
const queryString = require('query-string');
const {google} = require('googleapis');
var app = express();
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded({
  extended: true
}));
let Useremail=null;
require('dotenv').config();
var OAuth2 = google.auth.OAuth2;
app.use(express.static(__dirname + '/heroku'));
app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
        let targeturl=getAuthUrl();
        res.render('index1',{ url: targeturl });
    });
app.post('/', function(req, res) {
  request.post('process.env.serverURL',
              {
              'auth': {
                'username': Useremail,
                'password': req.body['pass'],
                'sendImmediately': true
              },
              json: {
              message: req.body['textMessage']
              }
            },function (error, response, body) {
          if (!error && response.statusCode == 200) {
              console.log(body);
              res.render('EndPage');
          }
      }
  );
  res.end;
})
app.get('/MsgAgain',function(req,res){
  res.render('TextForm',{ mail: Useremail });
})
const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID ,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  redirect: process.env.GOOGLE_REDIRECT_URL,
};
const defaultScope = [
  'https://www.googleapis.com/auth/plus.me',
  'https://www.googleapis.com/auth/userinfo.email',
];
const  oauth2Client= new OAuth2(
    googleConfig.clientID,
    googleConfig.clientSecret,
    googleConfig.redirect
  );
function getAuthUrl () {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: defaultScope
    });
    return url;
}
app.get('/google-auth', async function(req, res) {

                let code=queryString.parseUrl(req.url).query.code;
                try{
                      // const {tokens} = await(oauth2Client.getToken(code));
                      // oauth2Client.setCredentials(tokens);
                      // const plus = google.plus({ version: 'v1', oauth2Client });
                      // const me = await(plus.people.get({ userId: 'me' }));
                      // const userEmail = me.data.emails[0].value;
                    const Useremail = 'munjewar.payal@gmail.com';
                      console.log(Useremail);
                    if(checkEmail(Useremail) == true)
                     {
                       res.render('TextForm',{ mail: Useremail });
                     }
                     else{
                       res.render('Unauthorized',{ mail: Useremail });
                     }
                }
                catch(err){
                  console.log(err);
                }


    });
function checkEmail(mail)
{
  console.log(process.env.USEREMAIL1 );
  console.log(mail );
  if(mail === process.env.USEREMAIL1 || mail === process.env.USEREMAIL2){
console.log("1" );
    return true;
  }else {

    return false;
  }
}
app.listen(process.env.PORT, () => console.log(`Example app listening on port `))
