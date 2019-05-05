
const { HookConfig } = require('../../db').Models
const request = require('request')
// Note Hook / Tag Push Hook / Issue Hook / Note Hook / Merge Request Hook / Wiki Page Hook / Pipeline Hook / Build Hook

// 根据分支配置或者是分支名上挂的组名分发
let filterConfigs = (hookConfigs, data, event) => {
    let getConfigByTeamName = (branchName) => {
        return hookConfigs.find(x => x.projectTeam && branchName.indexOf(`@${x.projectTeam}`) !== -1)
    }

    let config
    switch (event) {
        case 'Push Hook':
            config = hookConfigs.find(x => x.branchs.some(b => data.ref.indexOf(b) !== -1)) || getConfigByTeamName(data.ref)
            break;
        case 'Note Hook':
            let branchGetter = (noteType) => {
                switch (noteType) {
                    case 'MergeRequest':
                        return data.merge_request.target_branch
                    case 'Commit':
                    case 'Issue':
                    case 'Snippet':
                        return data.project.default_branch
                    default:
                        return data.project.default_branch
                }
            };

            let branch = branchGetter(data.object_attributes.noteable_type)

            config = hookConfigs.find(x => x.branchs.some(b => b == branch)) || getConfigByTeamName(branch)
            break;
        case 'Tag Push Hook':
            config =  hookConfigs.find(x => x.branchs.some(b => data.ref.indexOf(b) !== -1)) || getConfigByTeamName(data.ref)
            break;
        case 'Issue Hook':
            break;
        case 'Merge Request Hook':
            config = hookConfigs.find(x => x.branchs.some(b => b == data.object_attributes.target_branch)) || getConfigByTeamName(data.object_attributes.target_branch)
            break;
        case 'Wiki Page Hook':
            break;
        case 'Pipeline Hook':
            break;
        case 'Build Hook':
            break;
    }

    return [config || hookConfigs.find(x => x.isDefault)]
}

let actions = {
    async tigger(ctx, next) {
        let event = ctx.header['x-gitlab-event']
        let project = (ctx.request.body.project && ctx.request.body.project.name) || ctx.params.project;

        if (!event || !project) {
            return ctx.body = new ctx.Model.Response().fail('参数错误');
        }

        ctx.logger.info(ctx.request.body)

        let ignoreEvent = ['Wiki Page Hook', 'Pipeline Hook']; // 屏蔽事件列表
        if (ignoreEvent.some(x => x == event)) {
            ctx.logger.info('忽略的事件：' + event)
            return;
        }

        let projectConfigs = await HookConfig.find({ project }).exec()
        let configs = filterConfigs(projectConfigs, ctx.request.body, event)
        if (!configs || !configs.length) {
            return ctx.logger.error('未找到匹配通知对象');
        }
        ctx.logger.info(`start tigger => ${project}[${event}]: ${config.targetUri}`)

        configs.forEach(config => {
            let options = {
                url: config.targetUri,
                json: true,
                headers: {
                    "content-type": "application/json"
                },
                body: ctx.request.body
            };

            request.post(options, (err, response, body) => {
                if (err) {
                    ctx.logger.error(err);
                }
            })
        })

        ctx.body = new ctx.Model.Response()
    }
}

module.exports = actions;