let express = require('express');
let userModel = require('../model/user');
let sendJSON = require('../lib/send-json');

let router = module.exports = express.Router();

router.get('/login', (req, res) => {
	let { phone, password } = req.query;
	if (!phone || !password) {
		sendJSON.err(res, '用户名或密码不得为空');
		return;
	}
	let info = userModel.getInfoByPhone(phone);
	if (!info) {
		sendJSON.err(res, '用户不存在');
		return;
	}
	if (info.password !== password) {
		sendJSON.err(res, '密码不正确');
		return;
	}
	sendJSON.ok(res, info.token);
});
router.get('/checkLogin', (req, res) => {
	let { token } = req.query;
	if (!token) {
		sendJSON.err(res, 'token为空');
		return;
	}
	let info = userModel.getInfoByToken(phone);
	if (!info) {
		sendJSON.err(res, '用户不存在');
		return;
	}
	sendJSON.ok(res, info);
});

router.get('/updatePassword', (req, res) => {
	let { phone, oldPassword, newPassword } = req.query;
	if (!phone || !oldPassword || !newPassword) {
		sendJSON.err(res, '用户名或密码不得为空');
		return;
	}
	let info = userModel.getInfoByPhone(phone);
	if (!info) {
		sendJSON.err(res, '用户不存在');
		return;
	}
	if (info.password !== oldPassword) {
		sendJSON.err(res, '原密码不正确');
		return;
	}
	info.password = newPassword;
	userModel.updateInfoByPhone(phone, info);
	sendJSON.ok(res, newPassword);
});
