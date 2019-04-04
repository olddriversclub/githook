const mongoose = require('../db')

let HookConfigSchema = mongoose.Schema({
    name: String,
    project: {
        type: String,
        required: [true, '仓库名必填']
    },
    projectTeam: {
        type: String,
        required: [true, '项目组名必填']
    },
    branchs: {
        type: Array,
        items: {
            type: String
        }
    },
    targetUri: {
        type: String,
        required: [true, '钉钉通知地址必填']
    },
    isDefault: Boolean,
    createdAt: Date
})

module.exports = HookConfigSchema;