<template>
  <div class="index-container">
    <el-row :gutter="20">
      <el-col
        v-for="(item, index) in iconList"
        :key="index"
        :xs="12"
        :sm="6"
        :md="3"
        :lg="3"
        :xl="3"
      >
        <el-card class="icon-panel" shadow="never">
          <vab-icon
            :style="{ color: item.color }"
            :icon="['fas', item.icon]"
          ></vab-icon>
          <p>{{ item.title }}</p>
          <p class="statics-value">{{ item.value }}</p>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import xhr from '@/utils/xhr'
  import VabChart from '@/plugins/echarts'
  import { dependencies, devDependencies } from '../../../package.json'

  export default {
    name: 'Index',
    components: {
      //VabChart,
    },
    data() {
      return {
        timer: 0,
        updateTime: process.env.VUE_APP_UPDATE_TIME,
        nodeEnv: process.env.NODE_ENV,
        dependencies: dependencies,
        devDependencies: devDependencies,
        config1: {
          startVal: 0,
          endVal: this.$baseLodash.random(20000, 60000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        config2: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },
        config3: {
          startVal: 0,
          endVal: this.$baseLodash.random(1000, 20000),
          decimals: 0,
          prefix: '',
          suffix: '',
          separator: ',',
          duration: 8000,
        },

        //更新日志
        reverse: true,
        activities: [],
        noticeList: [],
        //其他信息
        userAgent: navigator.userAgent,
        //卡片图标
        iconList: [
          {
            icon: 'video',
            title: '全网节点数',
            link: '/vab/player',
            color: '#ffc069',
          },
          {
            icon: 'table',
            title: '表格',
            link: '/vab/table/comprehensiveTable',
            color: '#5cdbd3',
          },
          {
            icon: 'laptop-code',
            title: '源码',
            link: 'https://github.com/chuzhixin/vue-admin-beautiful',
            color: '#b37feb',
          },
          {
            icon: 'book',
            title: '书籍',
            link: '',
            color: '#69c0ff',
          },
          {
            icon: 'bullhorn',
            title: '公告',
            link: '',
            color: '#ff85c0',
          },
          {
            icon: 'gift',
            title: '礼物',
            link: '',
            color: '#ffd666',
          },

          {
            icon: 'balance-scale-left',
            title: '公平的世界',
            link: '',
            color: '#ff9c6e',
          },
          {
            icon: 'coffee',
            title: '休息一下',
            link: '',
            color: '#95de64',
          },
        ],
      }
    },
    created() {
      this.fetchData()
    },
    beforeDestroy() {
      clearInterval(this.timer)
    },
    mounted() {},
    methods: {
      handleClick(e) {
        this.$baseMessage(`点击了${e.name},这里可以写跳转`)
      },
      handleZrClick(e) {},
      handleChangeTheme() {
        this.$baseEventBus.$emit('theme')
      },
      async fetchData() {
        // load external statistics data
        // https://api.nrgh.com.cn/swarmCount/nodesAndCheque
        let data = await xhr(
          'GET',
          'https://api.nrgh.com.cn/swarmCount/nodesAndCheque'
        )

        let statistics = JSON.parse(data)
        console.log('statistics:', statistics)
        let entry = []
        // 全网节点数
        entry[0] = {
          value: statistics.data.totalStatistics.nodeCount,
          icon: 'network-wired',
          title: '全网节点数',
          color: '#ffc069',
        }
        // 24小时新增节点
        entry[1] = {
          value: statistics.data.statisticsIn24h.nodeCount,
          icon: 'plus',
          title: '24小时新增节点',
          color: '#5cdbd3',
        }
        // 24小时出票
        entry[2] = {
          value: statistics.data.statisticsIn24h.chequeCount,
          icon: 'clipboard-check',
          title: '24小时出票',
          color: '#b37feb',
        }

        // 全网出票节点
        entry[3] = {
          value: statistics.data.totalStatistics.activeNodeCount,
          icon: 'clipboard-check',
          title: '全网出票节点',
          color: '#69c0ff',
        }

        // 24小时出票节点
        entry[4] = {
          value: statistics.data.statisticsIn24h.activeNodeCount,
          icon: 'network-wired',
          title: '24小时出票节点',
          color: '#ff85c0',
        }

        // 24小时BZZ兑换
        entry[5] = {
          value: statistics.data.statisticsIn24h.bzzCount,
          icon: 'sync',
          title: '24小时BZZ兑换',
          color: '#ff9c6e',
        }

        this.iconList = entry
      },
    },
  }
</script>
<style lang="scss" scoped>
  .index-container {
    padding: 0 !important;
    margin: 0 !important;
    background: #f5f7f8 !important;

    ::v-deep {
      .el-alert {
        padding: $base-padding;

        &--info.is-light {
          min-height: 82px;
          padding: $base-padding;
          margin-bottom: 15px;
          color: #909399;
          background-color: $base-color-white;
          border: 1px solid #ebeef5;
        }
      }

      .el-card__body {
        .echarts {
          width: 100%;
          height: 115px;
        }
      }
    }

    .card {
      ::v-deep {
        .el-card__body {
          .echarts {
            width: 100%;
            height: 305px;
          }
        }
      }
    }

    .bottom {
      padding-top: 20px;
      margin-top: 5px;
      color: #595959;
      text-align: left;
      border-top: 1px solid $base-border-color;
    }

    .table {
      width: 100%;
      color: #666;
      border-collapse: collapse;
      background-color: #fff;

      td {
        position: relative;
        min-height: 20px;
        padding: 9px 15px;
        font-size: 14px;
        line-height: 20px;
        border: 1px solid #e6e6e6;

        &:nth-child(odd) {
          width: 20%;
          text-align: right;
          background-color: #f7f7f7;
        }
      }
    }

    .icon-panel {
      height: 117px;
      text-align: center;
      cursor: pointer;

      svg {
        font-size: 40px;
      }

      p {
        margin-top: 10px;
      }
    }

    .bottom-btn {
      button {
        margin: 5px 10px 15px 0;
      }
    }

    .statics-value {
      font-size: 11px;
      font-weight: bold;
    }
  }
</style>
