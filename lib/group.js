'use strict';
async function set(group, title) {
	if (!(group && typeof group === "string")) {
		return false;
	}
	const {result, modifiedCount, upsertedCount} = await this.db.group.update({group}, {group, title}, {upsert: true});
	return Boolean(result && result.ok && (result.nModified || modifiedCount || upsertedCount));
}
async function get(group) {
	if (group && typeof group === "string") {
		return await this.db.group.findOne({group});
	}
	return await this.db.group.find().toArray();
}
async function remove(group) {
	if (!( group && typeof group === "string")) {
		return false;
	}
	await this.db.nav.deleteMany({group});
	let {result} = await this.db.group.deleteMany({group});
	return Boolean(result && result.ok);
}

exports.set = set;
exports.get = get;
exports.remove = remove;
