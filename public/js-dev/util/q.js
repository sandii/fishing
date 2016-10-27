function q( key ){
	let reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	let r = location.search.substr(1).match(reg);
	if (r != null) return unescape(r[2]);
	return '';
};
module.exports = q;