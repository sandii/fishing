let getToken = () => {
	let token = localStorage.getItem('token');
	if ( !token ) location = 'login.html';
	return token;
};
module.exports = getToken;
