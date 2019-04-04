var http = axios.create();
http.interceptors.response.use(function (response) {
    return response.data.state == 0 ? response.data : Promise.reject(response.data);
}, function (error) {
    return Promise.reject(error);
})


new Vue({
    el: '#app',
    data: {
        projects: [],
        editModel: {},
        editForm: {
            isCreate: false,
            opened: false,
        },
        ruleValidate: {
            project: [
                { required: true, message: 'The project cannot be empty', trigger: 'blur' }
            ],
            projectTeam: [
                { required: true, message: 'projectTeam cannot be empty', trigger: 'blur' }
            ],
            targetUri: [
                { required: true, message: 'The targetUri cannot be empty', trigger: 'blur' }
            ]
        }
    },
    methods: {
        loadData() {
            return http.get('/hook/getConfigs')
                .then(response => {
                    this.projects = response.data.reduce((arr, val) => {
                        let c = arr.find(x => x.project == val.project);
                        if (!c) {
                            c = {
                                project: val.project,
                                configs: []
                            }
                            arr.push(c)
                        }
                        c.configs.push(val)

                        return arr
                    }, []);
                })
        },
        appendBranch(config) {
            // 直接给某个配置增加分支
            let value = '';
            this.$Modal.confirm({
                render: (h) => {
                    return h('Input', {
                        props: {
                            autofocus: true,
                            placeholder: 'Please enter your branch name...'
                        },
                        on: {
                            input: (val) => {
                                value = val;
                            }
                        }
                    })
                },
                onOk: () => {
                    if (value) {
                        config.branchs.push(value);
                        this.httpSubmitConfig(config);
                    }
                }
            })
        },
        removeBranch(config, branch) {
            this.$Modal.confirm({
                title: '提示',
                content: `<p>确定移除分支${branch}?</p>`,
                onOk: () => {
                    config.branchs.splice(config.branchs.indexOf(branch), 1);
                    this.httpSubmitConfig(config);
                }
            });
        },
        updateConfig(config = {
            name: '',
            project: '',
            projectTeam: '',
            branchs: [],
            targetUri: '',
            isDefault: false
        }) {
            this.editModel = JSON.parse(JSON.stringify(config));
            this.editForm.opened = true;
            this.editForm.isCreate = !config.id;
        },
        deleteConfig(config) {
            this.$Modal.confirm({
                title: '提示',
                content: `<p>确定删除配置 ${config.project} - ${config.projectTeam} ?</p>`,
                onOk: () => {
                    return http.post('/hook/removeConfig', { id: config._id }).then(response => {
                        this.$Message.success('success!');
                        this.loadData();
                    }).catch(err => {
                        this.$Message.error(err.message);
                    })
                }
            });
        },
        addBranch(config) {
            let value = '';
            this.$Modal.confirm({
                render: (h) => {
                    return h('Input', {
                        props: {
                            autofocus: true,
                            placeholder: 'Please enter your branch name...'
                        },
                        on: {
                            input: (val) => {
                                value = val;
                            }
                        }
                    })
                },
                onOk() {
                    value && config.branchs.push(value);
                }
            })
        },
        delBranch(editModel, branch) {
            editModel.branchs.splice(editModel.branchs.indexOf(branch), 1);
        },
        saveConfig(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.httpSubmitConfig(this.editModel);
                    this.editForm.opened = false;
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        cancelEdit(name) {
            this.$refs[name].resetFields();
            this.editForm.opened = false;
        },
        httpSubmitConfig(config) {
            return http.post('/hook/updateConfig', config).then(response => {
                this.$Message.success('success!');
                this.loadData();
            }).catch(err => {
                this.$Message.error(err.message);
            })
        }
    },
    created() {
        this.loadData();
    }
})