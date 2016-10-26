let express = require('express');
let userModel = require('./model/user');

let app = express();
app.listen(9000, () => console.log(9000));
app.use( '/public', express.static('./public') );

app.get('/', (req, res) => {
  res.send('hello fishing!');
});
app.get('/login', (req, res) => {
	let { phone, password } = req.query;
	if (!phone || !password) {
		err(res, '用户名或密码不得为空');
		return;
	}
	let info = userModel.getInfoByPhone(phone);
	if (!info) {
		err(res, '用户不存在');
		return;
	}
	if (info.password !== password) {
		err(res, '密码不正确');
		return;
	}
	ok(res, info.token);
});
app.get('/updatePassword', (req, res) => {
	let { phone, oldPassword, newPassword } = req.query;
	if (!phone || !oldPassword || !newPassword) {
		err(res, '用户名或密码不得为空');
		return;
	}
	let info = userModel.getInfoByPhone(phone);
	if (!info) {
		err(res, '用户不存在');
		return;
	}
	if (info.password !== oldPassword) {
		err(res, '原密码不正确');
		return;
	}
	info.password = newPassword;
	userModel.updateInfoByPhone(phone, info);
	ok(res, newPassword);
});

function ok (res, data) {
	let code = 0;
	let	msg = 'ok';
	res.send({ code, msg, data });
}
function err (res, msg) {
	let code = -1;
	let data = null;
	res.send({ code, msg, data });
}
