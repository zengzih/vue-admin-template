import axios from "axios";
export const currying = (base) => {
	return (url, method = 'get', headers={}) => {
		const URL = base ? base + url : url
		// const URL = window.location.origin + '/' + newUrl;
		return (params={}) => {
			params = method === 'post' ? params : {params}
			return new Promise((resolve, reject) => {
				axios[method](URL, params, headers).then(res => {
					return resolve(res.data);
				}).catch(error => {
					reject(error);
				})
			});
		}
	}
};
