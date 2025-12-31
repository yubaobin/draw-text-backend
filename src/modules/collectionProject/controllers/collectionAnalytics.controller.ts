import { Controller, Get, Headers, HttpCode, HttpStatus, Query } from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { BaseController } from '@/modules/common/base.controller'
import { CollectionAnalyticsService } from '../services/collectionAnalytics.service'
import { AnalyticsTimeseriesDto } from '../dto/analyticsTimeseries.dto'
import { AnalyticsPageDistributionDto } from '../dto/analyticsPageDistribution.dto'
import { AnalyticsReferrerDistributionDto } from '../dto/analyticsReferrerDistribution.dto'
import { AnalyticsDomEventTopDto } from '../dto/analyticsDomEventTop.dto'
import { AnalyticsRetentionDto } from '../dto/analyticsRetention.dto'
import { AnalyticsCompareDto } from '../dto/analyticsCompare.dto'
import { AnalyticsConversionDto } from '../dto/analyticsConversion.dto'
import { AnalyticsUserDistributionDto } from '../dto/analyticsUserDistribution.dto'
import { AnalyticsCustomEventStatDto } from '../dto/analyticsCustomEventStat.dto'

@ApiTags('用户信息收集-分析')
@Controller('analytics')
export class CollectionAnalyticsController extends BaseController {
  constructor (private readonly analyticsService: CollectionAnalyticsService) {
    super()
  }

  @ApiOperation({ summary: '概览趋势（折线/柱状）' })
  @ApiOkResponse({ description: 'series + metric' })
  @HttpCode(HttpStatus.OK)
  @Get('timeseries')
  timeseries (@Query() params: AnalyticsTimeseriesDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.timeseries(params, appSecret)
  }

  @ApiOperation({ summary: '页面分布（饼图/柱状）' })
  @ApiOkResponse({ description: 'name/value 列表' })
  @HttpCode(HttpStatus.OK)
  @Get('page-distribution')
  pageDistribution (@Query() params: AnalyticsPageDistributionDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.pageDistribution(params, appSecret)
  }

  @ApiOperation({ summary: '来源分布（饼图）' })
  @ApiOkResponse({ description: 'name/value 列表' })
  @HttpCode(HttpStatus.OK)
  @Get('referrer-distribution')
  referrerDistribution (@Query() params: AnalyticsReferrerDistributionDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.referrerDistribution(params, appSecret)
  }

  @ApiOperation({ summary: '元素事件 Top（柱状）' })
  @ApiOkResponse({ description: 'event_type/page_url/element_type/element_name/group_key/event_count 列表' })
  @HttpCode(HttpStatus.OK)
  @Get('dom-event-top')
  domEventTop (@Query() params: AnalyticsDomEventTopDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.domEventTop(params, appSecret)
  }

  @ApiOperation({ summary: '留存（折线/热力表）' })
  @ApiOkResponse({ description: '留存数据' })
  @HttpCode(HttpStatus.OK)
  @Get('retention')
  retention (@Query() params: AnalyticsRetentionDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.retention(params, appSecret)
  }

  @ApiOperation({ summary: '指标对比（多序列）' })
  @ApiOkResponse({ description: 'series: { metric: [{date,value}] }' })
  @HttpCode(HttpStatus.OK)
  @Get('compare')
  compare (@Query() params: AnalyticsCompareDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.compare(params, appSecret)
  }

  @ApiOperation({ summary: '转化趋势（折线）' })
  @ApiOkResponse({ description: 'series + metric=conversion_rate' })
  @HttpCode(HttpStatus.OK)
  @Get('conversion')
  conversion (@Query() params: AnalyticsConversionDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.conversion(params, appSecret)
  }

  @ApiOperation({ summary: '设备/平台分布（饼图）' })
  @ApiOkResponse({ description: 'name/value 列表' })
  @HttpCode(HttpStatus.OK)
  @Get('user-distribution')
  userDistribution (@Query() params: AnalyticsUserDistributionDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.userDistribution(params, appSecret)
  }

  @ApiOperation({ summary: '自定义事件字段计数（柱状/列表）' })
  @ApiOkResponse({ description: 'name/value 列表' })
  @HttpCode(HttpStatus.OK)
  @Get('custom-event-stats')
  customEventStats (@Query() params: AnalyticsCustomEventStatDto, @Headers('x-app-secret') appSecret?: string) {
    return this.analyticsService.customEventStats(params, appSecret)
  }
}
