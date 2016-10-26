let fs = require('fs');

const link = './db/user.json';
let = userList = [];
fs.readFile(link, (err, data) => {
	userList = JSON.parse(data.toString());
});

exports.getUserList = () => userList;

exports.getInfoByPhone = phone => {
	let info = null;
	userList.forEach(o => {
		if (o.phone === phone) info = o;
	});
	return info;
}

exports.getInfoByToken = token => {
	let info = null;
	userList.forEach(o => {
		if (o.token === token) info = o;
	});
	return info;
}

exports.updateInfoByPhone = (phone, info) => {
	userList.forEach((o, i) => {
		if (o.phone === phone) userList[i] = info;
	});
	updateFile();
}
exports.updateUserList = list => {
	userList = list;
	updateFile();
}


function updateFile () {
	let text = JSON.stringify(userList, null, 2);
	fs.writeFile(link, text);
}
