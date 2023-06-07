var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const protobuf = require('protobufjs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);
let root = null;
protobuf.load('user.proto').then((data) => {
  root = data;
});
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));

app.post('/', (req, res) => {
  const body = req.body;

  console.log(body);
  // const User = root.lookupType('GamePackage.User');

  // const buf = User.encode({ name: 'Bill', age: 30 }).finish();
  // console.log(buf.toString('utf8'));
  res.send(body);
});

let PlayerDatas = {
  ListId: [],
  ListData: [],
};

app.post('/login', (req, res) => {
  const body = req.body;
  console.log(body);
  // const User = root.lookupType('GamePackage.User');

  // const buf = User.encode({ name: 'Bill', age: 30 }).finish();
  // console.log(buf.toString('utf8'));
  const Id = Math.floor(Math.random() * 10000000);
  const data = {
    attribute: { Name: body.username, Token: 30, Level: 1000, Type: 1, Id: Id },
  };
  PlayerDatas.ListId.push(Id);
  PlayerDatas.ListData.push(data);

  setTimeout(() => res.send(data), 400);
});
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

server.listen(5000, () => {
  console.log('listening on http://localhost:5000');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('PlayerData', (data) => {
    console.log(data);
  });
  setInterval(() => {
    socket.emit('ListPlayerData', PlayerDatas);
  }, 1000);
});

// module.exports = app;
