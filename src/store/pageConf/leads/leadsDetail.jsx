export default function(data) {
  return {
    type: 'basic',
    title: '基本信息',
    rows: [
      [
        {
          label: '京东用户名：',
          value: data.jdpin
        },
        {
          label: '客户姓名：',
          value: data.name
        },
        {
          label: '客户手机号：',
          value: data.mobile
        },
        {
          label: '是否黑金：',
          value: data.isHeijinStr
        }
      ],
      [
        {
          label: '预约来源：',
          value: data.source
        },
        {
          label: '来源渠道：',
          value: data.channel
        },
        {
          label: '预约入口：',
          value: data.sourceUrl,
          formatter: (val, h) => {
            if (val) {
              return (
                <div>
                    <el-popover
                      placement="top-start"
                      title="链接地址"
                      width="200"
                      trigger="hover"
                      content={val}>
                      <el-button type="text" size="mini" slot="reference" style="padding: 2px 0 0 0 "
                                 onClick={() => { window.open(val); }} v-show={val}>查看</el-button>
                    </el-popover>
                </div>
              );
            } else {
              return (
                <div>
                    <span>-</span>
                </div>
              );
            }
          }
        },
        {
          label: '预约时间：',
          value: data.createTime
        }
      ],
      [
        {
          label: '所属省份：',
          value: data.region
        },
        {
          label: '所属城市：',
          value: data.city
        },
        {
          label: '预约姓名：',
          value: data.appointName
        },
        {
          label: '预约手机号：',
          value: data.appointMobile
        }
      ],
      [
        {
          label: '分享人pin：',
          value: data.sharerPin
        },
        {
          label: '是否为理财师分享：',
          value: data.isPlannerShareStr
        },
        {
          label: '分享理财师姓名：',
          value: data.sharePlannerName
        },
        {
          label: '预约类型：',
          value: data.appointTypeStr
        }
      ],
      [
        {
          label: '预约业务线：',
          value: data.appointWayStr
        },
        {
          label: '预约业务线子类：',
          value: data.productKindStr
        },
        {
          label: '预约产品名称：',
          value: data.productName
        },
        {
          label: '预约服务名称：',
          value: data.serviceName
        }
      ],
      [
        {
          label: '预约活动名称：',
          value: data.activityName
        },
        {
          label: '建议沟通时间：',
          value: data.contactTime
        },
        {
          label: '客户备注：',
          value: data.remark
        },
        {
          label: '预约描述：',
          value: data.appointDesc
        }
      ]
    ]
  };
}
