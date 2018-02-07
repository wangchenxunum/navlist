'use strict';
const {ObjectId} = require("mongodb");

class OperationError extends Error{
	constructor(msg) {
		super(msg);
	}
}


/** 获取ID */
function getId(id) {
	if (id instanceof ObjectId) {
		return id;
	}
	if (typeof id !== "string") {
		return null;
	}
	if(id.length!== 24) {
		return null;
	}
	if(id.search(/^[0-9a-f]{24}$/ig)) {
		return null;
	}
	return ObjectId(id);
}


/** 获取ID数组 */
function getIdArray(id) {
	let ret =[];
	if (Array.isArray(id)) {
		id.map(id=>{
			if(id = getId(id)) {
				ret.push(id);
			}
		})
	} else if(id = getId(id)) {
		ret.push(id);
	}
	return ret;
}

module.exports = {
	OperationError,
	getId,
	getIdArray,
}