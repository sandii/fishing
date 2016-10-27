exports.ok = (res, data) => {
	let code = 0;
	let	msg = 'ok';
	res.send({ code, msg, data });
};
exports.err = (res, msg) => {
	let code = -1;
	let data = null;
	res.send({ code, msg, data });
};