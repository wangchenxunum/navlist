'use strict';
const list = require("./list");
const group = require("./group");

module.exports = async function({collection}, init) {
	const ret = {list:{}, group: {}, config: {}};
	const that = Object.create(ret);
	that.db = {
		list: collection.list,
		group: collection.group,
	};
	for (let k in list) {
		ret.list[k] = list[k].bind(that);
	}
	for (let k in group) {
		ret.group[k] = group[k].bind(that);
	}
	if (init) {
		try {await that.db.list.ensureIndex({group: 1}, {name:"group"})} catch(e) {}
		try {await that.db.list.ensureIndex({parent: 1}, {name:"parent"})} catch(e) {}
		try {await that.db.list.ensureIndex({parent: 1, group: 1}, {name:"parent_group"})} catch(e) {}
		try {await that.db.list.ensureIndex({group: 1, parent: 1}, {name:"group_parent"})} catch(e) {}
		try {await that.db.group.ensureIndex({group: 1}, {name:"group"})} catch(e) {}
	}
	return ret;
}
