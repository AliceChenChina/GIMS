###Store结构配置

```
├─modules  模块文件，每个模块文件包含独立的mutations和state，
│  ├─consumer 客户管理模块
│  ├─leads  leads模块
│  ├─order  交易管理
│  ├─product  产品管理 
│  └─systemManager 系统管理
   ...
└─
└─actions 全局actions（暂时不分模块）
└─index.ts vuex入口配置文件和全局state信息（枚举state在全局状态）
└─mutations 全局mutations

```

####state访问方式
`this.$store.模块名.名称`

####提交commit方式
`this.$store.commit(模块名/XX_MUTATION名称)`

####提交actions方式
全局actions和原来方式一样