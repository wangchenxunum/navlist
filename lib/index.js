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


/**
 * 获取标准样式对象
 * @param  {Object} o 原始对象
 * @return {Object}   标准样式对象
 */
function getStyle(o) {
	let {color, bold, italic, underline, lineThrough, overline, icon, image, focusImage} = o || {};
	if (typeof color !== "string") {
		color = "";
	}
	if (typeof bold !== "boolean") {
		bold = false;
	}
	if (typeof italic !== "boolean") {
		italic = false;
	}
	if (typeof underline !== "boolean") {
		underline = false;
	}
	if (typeof lineThrough !== "boolean") {
		lineThrough = false;
	}
	if (typeof overline !== "boolean") {
		overline = false;
	}
	if (typeof icon !== "string") {
		icon = "";
	}
	if (typeof image !== "string") {
		image = "";
	}
	if (typeof focusImage !== "string") {
		focusImage = "";
	}
	return {color, bold, italic, underline, lineThrough, overline, icon, image, focusImage};
}

/**
 * 设置样式查询条件
 * @param {Object} r 查询条件
 * @param {Object} o 样式对象
 */
function setStyle(r, o) {
	if (!o) {
		return r;
	}
	const {color, bold, italic, underline, lineThrough, overline, icon, image, focusImage} = o;
	if (typeof color === "string") {
		r["style.color"] = color;
	}
	if (typeof bold === "boolean") {
		r["style.bold"] = bold;
	}
	if (typeof italic === "boolean") {
		r["style.italic"] = italic;
	}
	if (typeof underline === "boolean") {
		r["style.underline"] = underline;
	}
	if (typeof lineThrough === "boolean") {
		r["style.lineThrough"] = lineThrough;
	}
	if (typeof overline === "boolean") {
		r["style.overline"] = overline;
	}
	if (typeof icon === "string") {
		r["style.icon"] = icon;
	}
	if (typeof image === "string") {
		r["style.image"] = image;
	}
	if (typeof focusImage === "string") {
		r["style.focusImage"] = focusImage;
	}
}

/**
 * 创建导航
 * @param  {Id}						options.parent		父导航
 * @param  {String}					options.title		导航标题
 * @param  {String}					options.link		导航的链接
 * @param  {String}					options.flink		功能链接
 * @param  {String}					options.rlink		注册链接
 * @param  {Object}					options.style		导航样式
 * @param  {String}					options.openWith	打开方式
 * @param  {Boolean}				options.inSub		是否显示在子菜单
 * @param  {Boolean}				options.hide		是否隐藏
 * @param  {Number}					options.order		顺序好
 * @param  {String}					options.explain		注释
 * @param  {String}					register			注册类型
 * @return {Id}											创建后的Id
 */
async function create({parent, title, link, flink, rlink, style, openWith, inSub, hide, order, explain}, register) {
	if (!(title && typeof title === "string")) {
		throw new OperationError("导航标题无效")
	}
	parent = getId(parent);
	if (typeof link !== "string") {
		link = "";
	}
	if (typeof flink !== "string") {
		flink = "";
	}
	if (typeof rlink !== "string") {
		rlink = "";
	}
	if (typeof openWith !== "string") {
		openWith = "";
	}
	if (typeof explain !== "string") {
		explain = "";
	}
	if (typeof register !== "string") {
		register = "";
	}
	style = getStyle(style);
	inSub = Boolean(inSub);
	hide = Boolean(hide);
	if (typeof order === "number" && order >= 0 && order < 0xFFFFFF) {
		order = parseInt(order);
	} else {
		order = 0;
	}

	let {insertedIds} = await this.db.navigation.insert({parent, register, title, link, flink, rlink, style, openWith, inSub, hide, explain});
	if (!insertedIds) {
		throw new OperationError("创建失败");
	}
	let id = insertedIds[0];
	if (id) {
		return id;
	}
	throw new OperationError("创建失败");
}

/**
 * 修改导航
 * @param  {Id}						id					导航ID
 * @param  {Id}						options.parent		父导航
 * @param  {String}					options.title		导航标题
 * @param  {String}					options.link		导航的链接
 * @param  {String}					options.flink		功能链接
 * @param  {String}					options.rlink		注册链接
 * @param  {Object}					options.style		导航样式
 * @param  {String}					options.openWith	打开方式
 * @param  {Boolean}				options.inSub		是否显示在子菜单
 * @param  {Boolean}				options.hide		是否隐藏
 * @param  {Number}					options.order		顺序好
 * @param  {String}					options.explain		注释
 * @param  {String}					register			注册类型
 * @return {Boolean}									是否修改成功
 */
async function set(id, {parent, title, link, flink, rlink, style, openWith, inSub, hide, order, explain}, register) {
	if (!(id = getId(id))) {
		throw new OperationError("Id无效");
	}
	if (typeof register !== "string") {
		register = "";
	}
	let $set = {};
	if (parent === null || (parent = getId(parent))) {
		$set.parent = parent;
	}

	if (title && typeof title === "string") {
		$set.title = title;
	}
	if (typeof link === "string") {
		$set.link = link;
	}
	if (typeof flink === "string") {
		$set.flink = flink;
	}
	if (typeof rlink === "string") {
		$set.rlink = rlink;
	}
	setStyle($set, style);
	if (typeof openWith === "string") {
		$set.openWith = openWith;
	}
	if (typeof inSub === "boolean") {
		$set.inSub = inSub;
	}
	if (typeof hide === "boolean") {
		$set.hide = hide;
	}
	if (typeof explain ==="string") {
		$set.explain = explain;
	}
	if (typeof order === "number" && order >= 0 && order < 0xFFFFFF) {
		$set.order = parseInt(order);
	}
	if (Object.keys($set)) {
		throw new OperationError("没有要修改的项目");
	}
	let {result} = await this.db.navigation.update({_id: id, register}, {$set});
	return Boolean(result && result.ok && result.nModified);
}

/**
 * 移除导航
 * @param  {Id}						id					导航ID
 * @param  {String}					register			注册类型
 * @return {Boolean}									是否删除成功
 */
async function remove(id, register) {
	if (!(id = getId(id))) {
		throw new OperationError("Id无效");
	}
	if (typeof register !== "string") {
		register = "";
	}
	let {result} = await this.db.navigation.deleteMany({_id: id, register});
	return Boolean(result && result.ok);
}

/**
 * 获取导航信息
 * @param  {Id | Id[]}				id					导航ID或导航ID数组
 * @param  {String}					register			注册类型
 * @return {NavInfo | NavInfo[]}						导航信息
 */
async function get(id, register) {
	const condition = {};
	if (typeof register === "string") {
		condition.register = register;
	}
	if (Array.isArray(id)) {
		condition._id = {$in: getIdArray(id)};
		const info = await this.db.navigation.find(condition).toArray();
		info.forEach(info=>{
			info.id = info._id;
			delete info._id;
		});
		return info;
	} else if (!(id = getId(id))) {
		throw new OperationError("Id无效");
	}
	condition._id = id;
	const info = await this.db.navigation.findOne(condition);
	if (!info) {
		return null;
	}
	info.id = info._id;
	delete info._id;
	return info;
}

/**
 * 获取导航列表
 * @param  {Id}						options.parent		父导航
 * @param  {String}					options.register	注册类型
 * @param  {RegExp | String}		options.title		导航标题
 * @param  {String}					options.link		导航的链接
 * @param  {String}					options.flink		功能链接
 * @param  {String}					options.rlink		注册链接
 * @param  {String}					options.openWith	打开方式
 * @param  {Boolean}				options.inSub		是否显示在子菜单
 * @param  {Boolean}				options.hide		是否隐藏
 * @param  {Number}					options.skip		跳过的条数
 * @param  {Number}					options.limit		返回的最大记录数
 * @return {QueryList<NavInfo>}							查询结果
 */
async function list({parent, register, title, link, flink, rlink, openWith, inSub, hide, skip = 0, limit = 30,} = {}) {
	const condition = {};
	if (parent === null || (parent = getId(parent))) {
		condition.parent = parent;
	}
	if (typeof register === "string") {
		condition.register = register;
	}
	//标题
	if(title instanceof RegExp) {
		condition.title = title;
	} else if (title && typeof title) {
		condition.title = new RegExp(title
			.replace(/\\/g,"\\\\").replace(/\./g,"\\.")
			.replace(/\[/g, "\\[").replace(/\]/g, "\\]")
			.replace(/\(/g, "\\(").replace(/\)/g, "\\)")
			.replace(/\(/g, "\\{").replace(/\)/g, "\\}")
			.replace(/\^/g, "\\^").replace(/\$/g, "\\$")
			.replace(/\+/g, "\\+").replace(/\*/g, "\\*").replace(/\?/g, "\\?")
			.replace(/\s+/g, ".*"));
	}
	//链接
	if(link instanceof RegExp) {
		condition.link = link;
	} else if (typeof link === "string") {
		condition.link = link;
	}

	if (typeof flink === "string") {
		condition.flink = flink;
	}
	if (typeof rlink === "string") {
		condition.rlink = rlink;
	}
	if (typeof openWith === "string") {
		condition.openWith = openWith;
	}
	if (typeof inSub === "boolean") {
		condition.inSub = inSub;
	}
	if (typeof hide === "boolean") {
		condition.hide = hide;
	}

	const cursor = this.db.navigation.find(condition).skip(skip).limit(limit);
	const [list, total] = await Promise.all([cursor.toArray(), cursor.count()]);
	list.forEach(info => {
		info.id = info._id;
		delete info._id;
	});
	return {total, list};

}

/**
 * 获取子列表
 * @param  {Id}						id					父导航Id
 * @param  {Boolean | Undefined}	options.hasParent	是否获取父列表，默认根据父导航的inSub确定
 * @param  {Boolean | Undefined}	options.hide		获取的列表是否是隐藏的，默认为无论隐藏都获取，此选项不影响父导航
 * @param  {Boolean}				options.filter		是否过滤无效导航，默认值为false
 * @param  {Boolean}				options.sort		是否根据order排序，默认为true
 * @return {NavInfo[]}									导航列表
 */
async function subList(id, { hasParent, hide, filter = false, sort = true, } = {}) {
	if (!(id === null || (id = getId(id)))) {
		throw new OperationError("Id无效");
	}
	let parent;
	if (id && hasParent !== false) {
		parent = await this.db.navigation.findOne({_id: id});
		if (!parent) {
			return [];
		}
	}
	const condition = {parent: id, register: ""};
	if (typeof hide === "boolean") {
		condition.hide = hide;
	}
	const list = await this.db.navigation.find(condition).toArray();
	condition.parent = null;
	if (parent && (hasParent === true || parent.inSub)) {
		parent.isParent = true;
		parent.rlink = "";
		parent.order = -1;
		list.unshift(parent);
	}
	let ret = [];
	for (let i = 0, l = list.length; i < l; i++) {
		const item = list[i];
		const rlink = item.rlink;
		if (!rlink) {
			ret.push(item);
		} else {
			condition.register = rlink;
			const list = await this.db.navigation.find(condition).toArray();
			list.forEach(x => ret.push(x));
		}
	}
	if (filter) {
		ret = ret.filter(x => x.link && x.flink);
	}
	if (sort) {
		ret = ret.sort((a, b) => a.order - b.order);
	}
	return ret;
}

async function setRegister(register, title) {
	if (!(register && typeof register === "string")) {
		return false;
	}
	const {result, modifiedCount, upsertedCount} = await this.db.register.update({register}, {register, title}, {upsert: true});
	return Boolean(result && result.ok && (result.nModified || modifiedCount || upsertedCount));
}
async function getRegister(register) {
	if (register && typeof register === "string") {
		return await this.db.register.findOne({register});
	}
	return await this.db.register.find().toArray();
}
async function removeRegister(register) {
	if (!( register && typeof register === "string")) {
		return false;
	}
	await this.db.navigation.deleteMany({register});
	let {result} = await this.db.register.deleteMany({register});
	return Boolean(result && result.ok);
}


module.exports = async function({collection}, init) {
	const ret = {};
	const that = Object.create(ret);
	that.db = {
		navigation: collection.navigation,
		register: collection.register,
	};
	if (init) {
		try {await that.db.navigation.ensureIndex({register: 1}, {name:"register"})} catch(e) {}
		try {await that.db.navigation.ensureIndex({parent: 1}, {name:"parent"})} catch(e) {}
		try {await that.db.navigation.ensureIndex({parent: 1, register: 1}, {name:"parent_register"})} catch(e) {}
		try {await that.db.navigation.ensureIndex({register: 1, parent: 1}, {name:"register_parent"})} catch(e) {}
		try {await that.db.register.ensureIndex({register: 1}, {name:"register"})} catch(e) {}
	}

	ret.create = create.bind(that);
	ret.set = set.bind(that);
	ret.remove = remove.bind(that);
	ret.get = get.bind(that);
	ret.list = list.bind(that);
	ret.subList = subList.bind(that);

	ret.setRegister = setRegister.bind(that);
	ret.getRegister = getRegister.bind(that);
	ret.removeRegister = removeRegister.bind(that);

	return ret;
}


