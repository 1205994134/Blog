var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.ObjectId,
		//引用
		ref: 'Comment'
    },
    title: {
        type: mongoose.Schema.Types.ObjectId,
		//引用
		ref: 'Content'
    },
    postTime: {
        type: Date,
		default: new Date()
    },
    //评论内容
    content: {
        type: String,
        default: ''
    }
});