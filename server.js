var path = require('path');
var ejs = require('ejs');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', ejs.renderFile);
// set ejs root path to be /views
ejs.resolveInclude = function(name, filename) {
  var ext = path.extname(name);
  var includePath = path.resolve(path.join(__dirname, 'views'), name)
  if (!ext) {
    includePath += '.html';
  }
  return includePath;
};

var router = express.Router();

var counter = 0,
	todolist = {};

router.route('/item')
	.post(function(req, res){
		var id = counter += 1,
			item = req.body.item;

		todolist[id] = item;

		res.json({ message: 'Add item successfully!' });
	})
	.get(function(req, res){

		var data = {};

		for(key in todolist){
			if (typeof(todolist[key]) != 'undefined'){
				data[key] = todolist[key];
			}
		}

		res.json(data);
	})

router.route('/item/:id')
	.get(function(req, res){
		var id = req.params.id;

		res.json(todolist[id]);
	})
	.delete(function(req, res){
		var id = req.params.id;

		todolist[id] = undefined;

		res.json({ message: 'Delete item successfully!' });
	})
	.put(function(req, res){
		var id = req.params.id,
			item = req.body.item;

		todolist[id] = item;

		res.json({ message: 'Update item successfully!' });
	})

app.use('/', function(req,res){
	res.render('index.html');
});
app.use('/todo', router);
app.listen(process.env.PORT || 8080);
console.log('Server starts...');