import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { getConnection, Repository } from 'typeorm'
import { CollectionProjectEntity } from '../entities/collectionProject.entity'
import { AnalyticsTimeseriesDto } from '../dto/analyticsTimeseries.dto'
import { AnalyticsPageDistributionDto } from '../dto/analyticsPageDistribution.dto'
import { AnalyticsReferrerDistributionDto } from '../dto/analyticsReferrerDistribution.dto'
import { AnalyticsDomEventTopDto } from '../dto/analyticsDomEventTop.dto'
import { AnalyticsRetentionDto } from '../dto/analyticsRetention.dto'
import { AnalyticsCompareDto } from '../dto/analyticsCompare.dto'
import { AnalyticsConversionDto } from '../dto/analyticsConversion.dto'
import { AnalyticsUserDistributionDto } from '../dto/analyticsUserDistribution.dto'
import { AnalyticsCustomEventStatDto } from '../dto/analyticsCustomEventStat.dto'

// 支持的指标列表
const SUPPORTED_METRICS = [
  'pv_count',
  'uv_count',
  'session_count',
  'avg_session_duration',
  'bounce_rate',
  'dom_event_count',
  'custom_event_count',
  'conversion_count',
  'conversion_rate'
] as const

@Injectable()
export class CollectionAnalyticsService {
  constructor (
    @(InjectRepository(CollectionProjectEntity) as any)
    private readonly projectRepo: Repository<CollectionProjectEntity>
  ) {}

  private parseJsonSafe (val: any) {
    if (val == null) return null
    if (typeof val === 'object') return val
    if (typeof val === 'string') {
      try {
        const once = JSON.parse(val)
        if (typeof once === 'string') {
          try { return JSON.parse(once) } catch { return once }
        }
        return once
      } catch {
        return val
      }
    }
    return val
  }

  private async assertProjectSecret (project_id?: string, app_secret?: string) {
    if (!project_id) return
    const proj = await this.projectRepo.findOne({ where: { project_id } })
    if (!proj) {
      throw new HttpException('项目不存在', HttpStatus.OK)
    }
    if (app_secret && proj.app_secret !== app_secret) {
      throw new HttpException('权限校验失败', HttpStatus.OK)
    }
    if (proj.status === 0) {
      throw new HttpException('项目已禁用', HttpStatus.OK)
    }
  }

  async timeseries (params: AnalyticsTimeseriesDto, app_secret?: string) {
    const { project_id, metric, interval = 'day', date_from, date_to, page_url, event_type, conversion_event_name = 'purchase' } = params
    if (!project_id || !metric) {
      throw new HttpException('project_id 与 metric 必填', HttpStatus.OK)
    }
    
    // 检查指标是否支持
    if (!SUPPORTED_METRICS.includes(metric as any)) {
      throw new HttpException(
        `不支持的指标: ${metric}。支持的指标列表: ${SUPPORTED_METRICS.join(', ')}`,
        HttpStatus.OK
      )
    }
    
    await this.assertProjectSecret(project_id, app_secret)
    const conn = getConnection()
    const df = date_from || '1970-01-01'
    const dt = date_to || new Date()

    // 使用 DATE_FORMAT 返回字符串，避免时区导致的 Date 序列化问题
    const byDate = interval === 'hour'
      ? (col: string) => `DATE_FORMAT(${col}, '%Y-%m-%d') AS stat_date, DATE_FORMAT(${col}, '%H:00:00') AS stat_hour`
      : (col: string) => `DATE_FORMAT(${col}, '%Y-%m-%d') AS stat_date`

    const groupBy = interval === 'hour' ? 'stat_date, stat_hour' : 'stat_date'

    let sql = ''
    const args: any[] = []

    switch (metric) {
      case 'pv_count':
        sql = 'SELECT ' + byDate('pv.visit_time') + ', COUNT(*) AS value FROM t_collection_page_views pv WHERE pv.project_id = ? AND pv.visit_time BETWEEN ? AND ? ' + (page_url ? ' AND pv.page_url = ?' : '') + ' GROUP BY ' + groupBy + ' ORDER BY ' + groupBy
        args.push(project_id, df, dt)
        if (page_url) args.push(page_url)
        break
      case 'uv_count':
        sql = 'SELECT ' + byDate('pv.visit_time') + ', COUNT(DISTINCT pv.user_uuid) AS value FROM t_collection_page_views pv WHERE pv.project_id = ? AND pv.visit_time BETWEEN ? AND ? GROUP BY ' + groupBy + ' ORDER BY ' + groupBy
        args.push(project_id, df, dt)
        break
      case 'session_count':
        sql = 'SELECT ' + byDate('s.start_time') + ', COUNT(*) AS value FROM t_collection_user_sessions s WHERE s.project_id = ? AND s.start_time BETWEEN ? AND ? GROUP BY ' + groupBy + ' ORDER BY ' + groupBy
        args.push(project_id, df, dt)
        break
      case 'avg_session_duration':
        const byDateSession = interval === 'hour'
          ? 'DATE_FORMAT(pv.first_time, \'%Y-%m-%d\') AS stat_date, DATE_FORMAT(pv.first_time, \'%H:00:00\') AS stat_hour'
          : 'DATE_FORMAT(pv.first_time, \'%Y-%m-%d\') AS stat_date'
        const groupBySession = interval === 'hour' ? 'stat_date, stat_hour' : 'stat_date'
        sql = 'SELECT ' + byDateSession + ', AVG(pv.duration_sec) AS value FROM ( SELECT session_id, MIN(visit_time) AS first_time, GREATEST(TIMESTAMPDIFF(SECOND, MIN(visit_time), MAX(visit_time)), SUM(stay_duration)) AS duration_sec FROM t_collection_page_views WHERE project_id = ? AND visit_time BETWEEN ? AND ? GROUP BY session_id ) pv GROUP BY ' + groupBySession + ' ORDER BY ' + groupBySession
        args.push(project_id, df, dt)
        break
      case 'bounce_rate':
        const byDateBounce = interval === 'hour'
          ? 'DATE_FORMAT(pv.first_time, \'%Y-%m-%d\') AS stat_date, DATE_FORMAT(pv.first_time, \'%H:00:00\') AS stat_hour'
          : 'DATE_FORMAT(pv.first_time, \'%Y-%m-%d\') AS stat_date'
        const groupByBounce = interval === 'hour' ? 'stat_date, stat_hour' : 'stat_date'
        sql = 'SELECT ' + byDateBounce + ', ROUND(100 * SUM(CASE WHEN pv.page_count = 1 THEN 1 ELSE 0 END) / COUNT(*), 2) AS value FROM ( SELECT session_id, MIN(visit_time) AS first_time, COUNT(*) AS page_count FROM t_collection_page_views WHERE project_id = ? AND visit_time BETWEEN ? AND ? GROUP BY session_id ) pv GROUP BY ' + groupByBounce + ' ORDER BY ' + groupByBounce
        args.push(project_id, df, dt)
        break
      case 'dom_event_count':
        sql = 'SELECT ' + byDate('d.event_time') + ', COUNT(*) AS value FROM t_collection_dom_events d WHERE d.project_id = ? AND d.event_time BETWEEN ? AND ? ' + (event_type ? ' AND d.event_type = ?' : '') + ' GROUP BY ' + groupBy + ' ORDER BY ' + groupBy
        args.push(project_id, df, dt)
        if (event_type) args.push(event_type)
        break
      case 'custom_event_count':
        sql = 'SELECT ' + byDate('c.event_time') + ', COUNT(*) AS value FROM t_collection_custom_events c WHERE c.project_id = ? AND c.event_time BETWEEN ? AND ? ' + (conversion_event_name ? ' AND c.event_name = ?' : '') + ' GROUP BY ' + groupBy + ' ORDER BY ' + groupBy
        args.push(project_id, df, dt)
        if (conversion_event_name) args.push(conversion_event_name)
        break
      case 'conversion_count':
        sql = 'SELECT ' + byDate('c.event_time') + ', COUNT(*) AS value FROM t_collection_custom_events c WHERE c.project_id = ? AND c.event_time BETWEEN ? AND ? AND c.event_name = ? GROUP BY ' + groupBy + ' ORDER BY ' + groupBy
        args.push(project_id, df, dt, conversion_event_name)
        break
      case 'conversion_rate':
        sql = 'SELECT DATE_FORMAT(c.event_time, "%Y-%m-%d") AS stat_date, ROUND(100 * COUNT(*) / NULLIF((SELECT COUNT(*) FROM t_collection_user_sessions s WHERE s.project_id = ? AND DATE(s.start_time) = DATE(c.event_time)), 0), 2) AS value FROM t_collection_custom_events c WHERE c.project_id = ? AND c.event_name = ? AND c.event_time BETWEEN ? AND ? GROUP BY stat_date ORDER BY stat_date'
        args.push(project_id, project_id, conversion_event_name, df, dt)
        break
    }

    const rows = await conn.query(sql, args)
    return { series: rows.map((r: any) => ({ date: r.stat_hour != null ? `${r.stat_date} ${r.stat_hour}` : r.stat_date, value: Number(r.value) })), metric }
  }

  async pageDistribution (params: AnalyticsPageDistributionDto, app_secret?: string) {
    const { project_id, stat_date_from, stat_date_to, limit = 10 } = params
    await this.assertProjectSecret(project_id, app_secret)
    const conn = getConnection()
    const df = stat_date_from || '1970-01-01'
    const dt = stat_date_to || new Date()
    const sql = 'SELECT pv.page_url AS page_url, pv.page_title AS page_title, COUNT(*) AS value FROM t_collection_page_views pv WHERE pv.project_id = ? AND pv.visit_time BETWEEN ? AND ? GROUP BY pv.page_url, pv.page_title ORDER BY value DESC LIMIT ?'
    const rows = await conn.query(sql, [project_id, df, dt, Number(limit)])
    return rows.map((r: any) => ({ page_url: r.page_url || 'unknown', page_title: r.page_title || 'unknown', value: Number(r.value) }))
  }

  async referrerDistribution (params: AnalyticsReferrerDistributionDto, app_secret?: string) {
    const { project_id, start_time, end_time, limit = 10 } = params
    await this.assertProjectSecret(project_id, app_secret)
    const conn = getConnection()
    const df = start_time || '1970-01-01'
    const dt = end_time || new Date()
    const sql = 'SELECT COALESCE(pv.referrer, \'direct\') AS name, COUNT(*) AS value FROM t_collection_page_views pv WHERE pv.project_id = ? AND pv.visit_time BETWEEN ? AND ? GROUP BY name ORDER BY value DESC LIMIT ?'
    const rows = await conn.query(sql, [project_id, df, dt, Number(limit)])
    return rows.map((r: any) => ({ name: r.name, value: Number(r.value) }))
  }

  async domEventTop (params: AnalyticsDomEventTopDto, app_secret?: string) {
    const { project_id, event_type, start_time, end_time, limit = 10 } = params
    await this.assertProjectSecret(project_id, app_secret)
    const conn = getConnection()
    const df = start_time || '1970-01-01'
    const dt = end_time || new Date()
    const args: any[] = [project_id, df, dt]
    const sql = 'SELECT d.event_type, d.page_url AS page_url, d.element_type AS element_type, d.element_name AS element_name, d.element_selector AS element_selector, d.element_content AS element_content, COUNT(*) AS event_count FROM t_collection_dom_events d WHERE d.project_id = ? AND d.event_time BETWEEN ? AND ? ' + (event_type ? ' AND d.event_type = ?' : '') + ' GROUP BY d.event_type, page_url, element_type, element_name, element_selector, element_content ORDER BY event_count DESC LIMIT ?'
    if (event_type) args.push(event_type)
    args.push(Number(limit))
    const rows = await conn.query(sql, args)
    return rows.map((r: any) => ({ event_type: r.event_type, page_url: r.page_url || '', element_type: r.element_type, element_name: r.element_name, element_selector: r.element_selector || '', element_content: r.element_content || '', event_count: Number(r.event_count) }))
  }

  async retention (params: AnalyticsRetentionDto, app_secret?: string) {
    const { project_id, first_visit_date_from, first_visit_date_to, retention_day } = params
    await this.assertProjectSecret(project_id, app_secret)
    const conn = getConnection()
    const df = first_visit_date_from || '1970-01-01'
    const dt = first_visit_date_to || new Date()

    if (retention_day != null) {
      const sql = 'SELECT u.first_visit_date, COUNT(*) AS new_users, COUNT(DISTINCT s2.user_uuid) AS retained_users, ROUND(100 * COUNT(DISTINCT s2.user_uuid) / COUNT(*), 2) AS retention_rate FROM ( SELECT s.project_id, s.user_uuid, DATE_FORMAT(MIN(s.start_time), "%Y-%m-%d") AS first_visit_date FROM t_collection_user_sessions s WHERE s.project_id = ? AND s.start_time BETWEEN ? AND ? GROUP BY s.project_id, s.user_uuid ) u LEFT JOIN t_collection_user_sessions s2 ON s2.project_id = u.project_id AND s2.user_uuid = u.user_uuid AND DATE(s2.start_time) = DATE_ADD(u.first_visit_date, INTERVAL ? DAY) GROUP BY u.first_visit_date ORDER BY u.first_visit_date'
      const rows = await conn.query(sql, [project_id, df, dt, retention_day])
      return rows.map((r: any) => ({ first_visit_date: r.first_visit_date, new_users: Number(r.new_users), retained_users: Number(r.retained_users), retention_rate: Number(r.retention_rate) }))
    } else {
      const sql = 'SELECT u.first_visit_date, d.retention_day, COUNT(DISTINCT s2.user_uuid) AS retained_users FROM ( SELECT s.project_id, s.user_uuid, DATE_FORMAT(MIN(s.start_time), "%Y-%m-%d") AS first_visit_date FROM t_collection_user_sessions s WHERE s.project_id = ? AND s.start_time BETWEEN ? AND ? GROUP BY s.project_id, s.user_uuid ) u JOIN ( SELECT 1 AS retention_day UNION ALL SELECT 7 UNION ALL SELECT 30 ) d LEFT JOIN t_collection_user_sessions s2 ON s2.project_id = u.project_id AND s2.user_uuid = u.user_uuid AND DATE(s2.start_time) = DATE_ADD(u.first_visit_date, INTERVAL d.retention_day DAY) GROUP BY u.first_visit_date, d.retention_day ORDER BY u.first_visit_date, d.retention_day'
      const rows = await conn.query(sql, [project_id, df, dt])
      return rows.map((r: any) => ({ first_visit_date: r.first_visit_date, retention_day: Number(r.retention_day), retained_users: Number(r.retained_users) }))
    }
  }

  async compare (params: AnalyticsCompareDto, app_secret?: string) {
    const { project_id, metrics = '', event_type, page_url, stat_date_from, stat_date_to } = params
    const series: Record<string, any[]> = {}
    for (const metric of metrics.split(',').map(m => m.trim()).filter(Boolean)) {
      const res = await this.timeseries({ project_id, metric, interval: 'day', date_from: stat_date_from, date_to: stat_date_to, event_type, page_url }, app_secret)
      series[metric] = res.series
    }
    return { series }
  }

  async conversion (params: AnalyticsConversionDto, app_secret?: string) {
    const { project_id, page_url, stat_date_from, stat_date_to, interval = 'day', conversion_event_name = 'purchase' } = params
    return this.timeseries({ project_id, metric: 'conversion_rate', interval, date_from: stat_date_from, date_to: stat_date_to, page_url, conversion_event_name }, app_secret)
  }

  async userDistribution (params: AnalyticsUserDistributionDto, app_secret?: string) {
    const { project_id, dimension, start_time, end_time, limit = 10 } = params
    if (!dimension) throw new HttpException('dimension 必填', HttpStatus.OK)
    await this.assertProjectSecret(project_id, app_secret)
    const col = dimension
    const conn = getConnection()
    const df = start_time || '1970-01-01'
    const dt = end_time || new Date()
    const sql = 'SELECT u.' + col + ' AS name, COUNT(DISTINCT u.user_uuid) AS value FROM t_collection_users u JOIN t_collection_user_sessions s ON s.project_id = u.project_id AND s.user_uuid = u.user_uuid WHERE u.project_id = ? AND s.start_time BETWEEN ? AND ? GROUP BY u.' + col + ' ORDER BY value DESC LIMIT ?'
    const rows = await conn.query(sql, [project_id, df, dt, Number(limit)])
    return rows.map((r: any) => ({ name: r.name || 'unknown', value: Number(r.value) }))
  }

  async customEventStats (params: AnalyticsCustomEventStatDto, app_secret?: string) {
    const { project_id, field = 'event_name', event_category, event_name, start_time, end_time, limit = 10 } = params
    if (!project_id) throw new HttpException('project_id 必填', HttpStatus.OK)
    await this.assertProjectSecret(project_id, app_secret)
    const conn = getConnection()
    const df = start_time || '1970-01-01'
    const dt = end_time || new Date()
    const allowed = new Set(['event_name', 'event_category', 'event_value', 'event_label', 'page_url', 'event_properties'])
    const columns = String(field)
      .split(',')
      .map(s => s.trim())
      .filter(s => allowed.has(s))
    if (columns.length === 0) columns.push('event_name')

    const filters: string[] = []
    const args: any[] = [project_id, df, dt]
    if (event_category) { filters.push('event_category = ?'); args.push(event_category) }
    if (event_name) { filters.push('event_name = ?'); args.push(event_name) }
    const whereFilters = filters.length ? ' AND ' + filters.join(' AND ') : ''
    const groupByExpr = columns.join(', ')
    const selectCols = columns
      .map(c => {
        if (c === 'event_value') return `${c} AS ${c}`
        if (c === 'event_properties') return 'CAST(event_properties AS CHAR) AS event_properties'
        return `COALESCE(${c}, 'unknown') AS ${c}`
      })
      .join(', ')
    const sql = `SELECT 
      ${selectCols},
      COUNT(*) AS value
    FROM t_collection_custom_events 
    WHERE project_id = ? AND event_time BETWEEN ? AND ?${whereFilters}
    GROUP BY ${groupByExpr}
    ORDER BY value DESC
    LIMIT ?`
    args.push(Number(limit))
    const rows = await conn.query(sql, args)
    return rows.map((r: any) => {
      const item: any = { value: Number(r.value) }
      for (const c of columns) {
        if (c === 'event_properties') {
          item[c] = this.parseJsonSafe(r[c])
        } else {
          item[c] = r[c]
        }
      }
      return item
    })
  }
}
