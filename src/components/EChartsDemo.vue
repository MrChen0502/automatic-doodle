<template>
  <div class="dashboard">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <el-card v-for="stat in statsData" :key="stat.title" class="stat-card">
        <div class="stat-content">
          <div class="stat-title">{{ stat.title }}</div>
          <div class="stat-value">
            {{ stat.value }}
            <span v-if="stat.suffix" class="stat-suffix">{{ stat.suffix }}</span>
          </div>
          <div class="stat-trend" v-if="stat.trend">
            <span :class="stat.trend > 0 ? 'up' : 'down'">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
            <span class="trend-text">较昨日</span>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 图表区域 -->
    <div class="charts-grid">
      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>订单量</span>
            <el-radio-group v-model="orderType" size="small">
              <el-radio-button label="年">年</el-radio-button>
              <el-radio-button label="月">月</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div class="chart-container">
          <!-- 这里放 ECharts 图表 -->
          <div ref="orderChartRef" style="height: 300px"></div>
        </div>
      </el-card>

      <el-card class="chart-card">
        <template #header>
          <div class="card-header">
            <span>新增用户</span>
            <el-radio-group v-model="userType" size="small">
              <el-radio-button label="年">年</el-radio-button>
              <el-radio-button label="月">月</el-radio-button>
            </el-radio-group>
          </div>
        </template>
        <div class="chart-container">
          <div ref="userChartRef" style="height: 300px"></div>
        </div>
      </el-card>
    </div>

    <!-- 数据表格 -->
    <el-card class="table-card">
      <template #header>
        <div class="card-header">
          <span>订单明细</span>
          <el-button type="primary" size="small">导出</el-button>
        </div>
      </template>
      <el-table :data="tableData" stripe>
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="orderId" label="订单号" />
        <el-table-column prop="amount" label="金额" />
        <el-table-column prop="status" label="状态" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orderType = ref('年')
const userType = ref('年')

const statsData = ref([
  { title: '总支付订单', value: 51, trend: 12 },
  { title: '转化率', value: 60, suffix: '%', trend: 5 },
  { title: '总销售额', value: 3.74, suffix: '万', trend: -3 },
  { title: '总用户', value: 17, trend: 8 }
])

const tableData = ref([
  { date: '2024-01-01', orderId: 'ORD001', amount: '¥299', status: '已完成' },
  { date: '2024-01-02', orderId: 'ORD002', amount: '¥499', status: '处理中' }
])
</script>

<style scoped lang="less">
.dashboard {
  padding: 20px;
  background-color: #f5f7fa;
  min-height: 100vh;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.stat-card {
  border-radius: 12px;
  
  .stat-content {
    padding: 20px;
  }
  
  .stat-title {
    font-size: 14px;
    color: #909399;
    margin-bottom: 12px;
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: bold;
    color: #303133;
    
    .stat-suffix {
      font-size: 14px;
      font-weight: normal;
      margin-left: 4px;
    }
  }
  
  .stat-trend {
    margin-top: 12px;
    font-size: 12px;
    
    .up {
      color: #67c23a;
    }
    
    .down {
      color: #f56c6c;
    }
    
    .trend-text {
      color: #909399;
      margin-left: 4px;
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-card {
  border-radius: 12px;
}
</style>