let actions = {
    async getConfigs(ctx, next) {
        ctx.body = new ctx.Model.Response(await ctx.DB.Models.HookConfig.find().sort({ createdAt: -1 }).exec())
    },
    async updateConfig(ctx, next) {
        let config = ctx.request.body;

        let model = new ctx.DB.Models.HookConfig({
            name: config.name,
            project: config.project,
            projectTeam: config.projectTeam,
            branchs: config.branchs,
            targetUri: config.targetUri,
            isDefault: !!config.isDefault
        })

        let validateError = model.validateSync()
        if (validateError) {
            return ctx.body = new ctx.Model.Response().fail(Object.values(validateError.errors)[0].message)
        }

        if (config.isDefault) {
            let defaultData = await ctx.DB.Models.HookConfig.findOne({ _id: { $ne: config._id }, project: config.project, isDefault: true }).exec();
            if (defaultData) {
                return ctx.body = new ctx.Model.Response().fail(`[${config.project}]已存在默认配置`)
            }
        }

        if (config._id) {
            model._id = config._id
            let res = await ctx.DB.Models.HookConfig.updateOne({ _id: model._id }, model).exec()
            let response = new ctx.Model.Response();
            if (!res.n) {
                response.fail('更新失败，数据未找到')
            }
            ctx.body = response
        } else {
            model.createdAt = new Date()
            let res = await ctx.DB.Models.HookConfig.create(model)
            ctx.body = new ctx.Model.Response(null, res.id)
        }
    },
    async removeConfig(ctx, next) {
        let id = ctx.request.body && ctx.request.body.id;
        if (!id) {
            ctx.body = new ctx.Model.Response().fail('参数不正确')
        } else {
            let res = await ctx.DB.Models.HookConfig.findByIdAndDelete(id).exec()
            ctx.body = res ? new ctx.Model.Response() : new ctx.Model.Response().fail('数据不存在')
        }
    }
}

module.exports = actions