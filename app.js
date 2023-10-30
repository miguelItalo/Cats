const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session"); //Criar a sessão do usuário na aplicação
const FileStore = require("session-file-store")(session); //Salvar as sessões na pasta session
const flash = require("express-flash");
const app = express();
const User = require('./models/User')
const conn = require('./db/conn')

const hbs = exphbs.create({
  partialsDir: ['views/partials']
})

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(
  session({
    name:"session",
    secret:"SENHA_COM_SUPER_CRIPTOGRAFIA", 
    resave: false, 
    saveUninitialized: false,
    store: new FileStore({
      logFn: function(){},
      path: require('path').join(require('os').tmpdir(), 'sessions')
    }),
    cookie:{
      secure:false,
      maxAge:360000, //Um dia
      expires: new Date(Date.now() + 360000), //Forçar expirar em momento
      httpOnly: true
    }
  })
)

app.use(flash())

app.use(express.static("public"));

app.use((request, response, next)=>{
  if(request.session.userId){
    response.locals.session = request.session
  }
  next()
})

app.get('/', (req, res) => {
  const cats = [
          {
            index: '01',
            width: '600px'
          },
          {
            index: '02',
            width: '600px'
          },
          {
            index: '05',
            width: '600px'
          },
          {
            index: '11',
            width: '900px'
          },
          {
            index: '08',
            width: '900px'
          },
          {
            index: '04',
            width: '1800px'
          },
          {
            index: '12',
            width: '600px'
          },
          {
            index: '09',
            width: '600px'
          },
          {
            index: '06',
            width: '600px'
          },
          {
            index: '03',
            width: '900px'
          },
          {
            index: '13',
            width: '900px'
          },
          {
            index: '07',
            width: '1800px'
          },
        ]

  return res.render('home', { cats })
})

conn
  .sync()
  .then(() => {
    app.listen(9999, () => {
      console.log('http://localhost:9999');
    })
  })
  .catch((err) => console.log(err));
  