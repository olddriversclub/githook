# Git推送分流钩子

## 如何使用
> 目前服务跑在210服务器上，要是停了上去重启一下 `pm2:add`

#### Git中增加钩子，绑定需要的事件(Push events,Merge request events)，一个项目一个钩子所有人共用

URL：`http://githook.schoolis.cn/hook/tigger`

#### 在后台增加配置
[后台地址](http://githook.schoolis.cn/webhook.html)

```js
{
    name: String,
    project: String, // 仓库名（必须与git中一致）
    projectTeam: String, // 项目组名
    branchs: Array, // 分支名
    targetUri: String // gitlab通知机器人uri
}
```


#### 通知优先级：

- 找到配置中 `branchs` 与当前提交分支匹配的
- 当前分支命名规则为 `***@ProjectTeamName` 的，则找配置中 `projectTeam` 匹配的

*建议通过分支名匹配，省去每次建新分支都要来配置*

## Todolist:

 + 针对MR匹配相应人员增加钉钉@提醒
 + 根据master信息及发布信息，及时提醒相关同学合代码，以及合并状态可视化