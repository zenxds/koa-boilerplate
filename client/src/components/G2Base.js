import React, { Component } from 'react'
import G2, { Chart } from '@antv/g2'

// 关闭 G2 的体验改进计划打点请求
G2.track(false)

export default class G2Base extends Component {
  constructor(props, context) {
    super(props, context)

    this.chart = null
    this.chartRef = React.createRef()
  }

  componentDidMount() {
    this.setup()
  }

  componentDidUpdate(prevProps) {
    const { data: newData, chartConfig: newChartConfig } = this.props
    const { data: oldData, chartConfig: oldChartConfig } = prevProps

    if (newData !== oldData) {
      this.chart ? this.changeData(newData) : this.setup()
    }

    if (!this.chart) {
      return
    }

    if (newChartConfig.width !== oldChartConfig.width) {
      this.chart.changeWidth(newChartConfig.width)
    }
    if (newChartConfig.height !== oldChartConfig.height) {
      this.chart.changeHeight(newChartConfig.height)
    }
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy()
      this.chart = null
    }
  }

  /**
   * 数据为空时是否渲染图表
   * 地图的情况下可能为空也要渲染
   */
  shouldRenderEmpty() {
    return false
  }

  changeData(newData) {
    this.chart.changeData(this.transformData(newData))
  }

  setup() {
    const { chartConfig, data } = this.props

    /*
     * 已经初始化
     */
    if (this.chart) {
      return
    }

    /**
     * 防止一开始数据为空时图表渲染的比较奇怪
     */
    if (!this.shouldRenderEmpty() && (!data || !data.length)) {
      return
    }

    const chart = new Chart(
      Object.assign(
        {
          container: this.chartRef.current,
          data: this.transformData(data),
          forceFit: true,
        },
        chartConfig || {},
      ),
    )

    this.initChart(chart)
    this.chart = chart
  }

  /**
   * 具体如何初始化chart，由子类重写
   * @memberof G2Base
   */
  initChart(chart) {}

  /**
   * 对原始数据进行处理，由子类重写
   * @memberof G2Base
   */
  transformData(data) {
    return data
  }

  render() {
    return (
      <div className="g2-chart">
        <div
          ref={this.chartRef}
          style={{ height: this.props.chartConfig.height }}
        />
      </div>
    )
  }
}
