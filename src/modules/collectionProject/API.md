## 3. 用户 Users
资源对应表：t_collection_users

### 3.1 创建/更新用户（Upsert）
POST /api/v1/users

请求（存在 `project_id+user_uuid` 则更新 last_visit_time/累计指标，否则创建）
```
{
  "project_id": "proj_xxx",
  "user_uuid": "uuid_abc",
  "device_id": "device_1",
  "platform": "web",
  "browser": "Chrome",
  "os": "macOS",
  "first_visit_time": "2025-12-23T10:00:00+08:00",
  "last_visit_time": "2025-12-23T10:05:00+08:00"
}
```
响应
```
{ "project_id": "proj_xxx", "user_uuid": "uuid_abc" }
```

### 3.2 查询用户列表
GET /api/v1/users?project_id=&platform=&start_time=&end_time=&page=&page_size=

### 3.3 获取用户详情
GET /api/v1/projects/{project_id}/users/{user_uuid}

### 3.4 更新用户画像/累计指标
PATCH /api/v1/projects/{project_id}/users/{user_uuid}

请求（任意可选）
```
{
  "last_visit_time": "2025-12-23T10:06:00+08:00",
  "total_visit_count": 10,
  "total_page_count": 50,
  "total_duration": 3600
}
```

## 4. 会话 Sessions
资源对应表：t_collection_user_sessions

### 4.1 创建会话
POST /api/v1/sessions
```
{
  "session_id": "sess_xxx",
  "project_id": "proj_xxx",
  "user_uuid": "uuid_abc",
  "device_id": "device_123",
  "platform": "web",
  "browser": "Chrome",
  "os": "macOS",
  "ip_address": "1.2.3.4",
  "user_agent": "Mozilla/5.0 ...",
  "referrer": "https://ref.example.com",
  "landing_page": "https://site/page"
}
```

### 4.2 更新会话（心跳/活动）
PATCH /api/v1/sessions/{session_id}
```
{
  "exit_page": "https://site/exit"
}
```

### 4.3 查询会话
GET /api/v1/sessions?project_id=&user_uuid=&start_time=&end_time=&page=&page_size=

### 4.4 获取会话详情
GET /api/v1/sessions/{session_id}

## 5. 事件采集 Events

### 5.1 页面访问（PV）
表：t_collection_page_views

POST /api/v1/events/page-view
```
{
  "event_id": "evt_pv_xxx",
  "project_id": "proj_xxx",
  "user_uuid": "uuid_abc",
  "session_id": "sess_xxx",
  "page_url": "https://site/page",
  "page_title": "标题",
  "page_path": "/page",
  "referrer": "https://ref.example.com",
  "screen_width": 1440,
  "screen_height": 900,
  "viewport_width": 1280,
  "viewport_height": 720,
  "is_bounce": 0
}
```
响应：`{"event_id": "evt_pv_xxx"}`

#### 5.1.1 页面离开（补充停留时长）
用于在离开页面时补充停留时长（秒），写入 `t_collection_page_views.stay_duration`

POST /api/v1/events/page-leave

**认证方式**：
- Header: `uxdc-app-secret: <your_secret>`
- URL 参数: `?app-secret=<your_secret>` （推荐用于 sendBeacon）

支持两种查找页面的方式：
1. 使用 `event_id`（优先，精确匹配）
2. 使用字段组合：必须同时提供 `user_uuid` + `session_id` + `page_url` + `page_title` + `page_path`（匹配最新的一条）

```
{
  // 方式1：使用 event_id
  "event_id": "evt_pv_xxx",
  
  // 方式2：使用字段组合（必须同时提供以下5个字段）
  "user_uuid": "uuid_abc",
  "session_id": "sess_xxx",
  "page_url": "https://site/page",
  "page_title": "标题",
  "page_path": "/page",
  
  // 通用字段
  "leave_time": "2025-12-23T10:15:00+08:00", // 可选，不传则用服务端收到请求的时间
  "is_bounce": 0
}
```
响应：`{"event_id": "evt_pv_xxx"}`

注意：使用字段组合查询时，会匹配最新的访问记录（按 `visit_time` 降序）。


### 5.2 dom事件
表：t_collection_dom_events

POST /api/v1/events/click
```
{
  "event_id": "evt_click_xxx",
  "project_id": "proj_xxx",
  "user_uuid": "uuid_abc",
  "session_id": "sess_xxx",
  "page_url": "https://site/page",
  "event_type": "click",
  "event_time": "2025-12-23T10:12:00+08:00",
  "element_selector": "#btn_submit",
  "element_name": "提交",
  "element_type": "button",
  "element_content": "提交",
  "element_target_url": "https://site/next",
  "extra_data": {"color": "blue"}
}
```
响应：`{"event_id": "evt_click_xxx"}`


### 5.3 自定义事件
表：t_collection_custom_events

POST /api/v1/events/custom
```
{
  "event_id": "evt_custom_xxx",
  "project_id": "proj_xxx",
  "user_uuid": "uuid_abc",
  "session_id": "sess_xxx",
  "page_url": "https://site/page",
  "event_name": "purchase",
  "event_category": "commerce",
  "event_label": "sku_123",
  "event_value": 199.00,
  "event_time": "2025-12-23T10:15:00+08:00",
  "event_properties": {"sku": "123", "qty": 1}
}
```
响应：`{"event_id": "evt_custom_xxx"}`


## 6. 分析查询 Analytics

以下分析接口均支持可视化图表（柱状图、折线图、饼图），并与数据库表结构保持一致。除非特别说明，均需通过 Header 传递 `X-Project-Id` 和 `X-App-Secret`。

### 6.1 概览趋势（折线/柱状）
来源：基础明细表（不依赖预聚合表）

GET /api/v1/analytics/timeseries?project_id=&metric=&interval=&date_from=&date_to=&page_url=&event_type=

参数
- project_id: 必填
- metric: 必填，`pv_count` | `uv_count` | `session_count` | `dom_event_count` | `custom_event_count` | `avg_session_duration` | `bounce_rate` | `conversion_count` | `conversion_rate`
- interval: 可选，`day` 或 `hour`（默认 `day`）
- date_from/date_to: 可选，时间范围（ISO 8601 或日期）
- page_url: 可选（用于 PV/自定义事件过滤）
- event_type: 可选（用于 DOM 事件过滤，如 `click`/`hover`）

SQL 示例（按天统计 PV）
```sql
SELECT DATE(pv.visit_time) AS stat_date, COUNT(*) AS pv_count
FROM t_collection_page_views pv
WHERE pv.project_id = :project_id
  AND pv.visit_time BETWEEN :date_from AND :date_to
  /* 可选：AND pv.page_url = :page_url */
GROUP BY stat_date
ORDER BY stat_date;
```

SQL 示例（按小时统计 PV）
```sql
SELECT DATE(pv.visit_time) AS stat_date, HOUR(pv.visit_time) AS stat_hour, COUNT(*) AS pv_count
FROM t_collection_page_views pv
WHERE pv.project_id = :project_id
  AND pv.visit_time BETWEEN :date_from AND :date_to
GROUP BY stat_date, stat_hour
ORDER BY stat_date, stat_hour;
```

SQL 示例（UV：按天唯一用户）
```sql
SELECT DATE(pv.visit_time) AS stat_date, COUNT(DISTINCT pv.user_uuid) AS uv_count
FROM t_collection_page_views pv
WHERE pv.project_id = :project_id
  AND pv.visit_time BETWEEN :date_from AND :date_to
GROUP BY stat_date
ORDER BY stat_date;
```

SQL 示例（会话数与平均会话时长、跳出率）
```sql
-- 会话数
SELECT DATE(s.start_time) AS stat_date, COUNT(*) AS session_count
FROM t_collection_user_sessions s
WHERE s.project_id = :project_id AND s.start_time BETWEEN :date_from AND :date_to
GROUP BY stat_date ORDER BY stat_date;

-- 平均会话时长（秒）
SELECT DATE(s.start_time) AS stat_date, AVG(s.duration) AS avg_session_duration
FROM t_collection_user_sessions s
WHERE s.project_id = :project_id AND s.start_time BETWEEN :date_from AND :date_to
GROUP BY stat_date ORDER BY stat_date;

-- 跳出率（page_count=1 的会话 / 总会话）
SELECT DATE(s.start_time) AS stat_date,
       ROUND(100 * SUM(CASE WHEN s.page_count = 1 THEN 1 ELSE 0 END) / COUNT(*), 2) AS bounce_rate
FROM t_collection_user_sessions s
WHERE s.project_id = :project_id AND s.start_time BETWEEN :date_from AND :date_to
GROUP BY stat_date ORDER BY stat_date;
```

SQL 示例（DOM 事件与自定义事件）
```sql
-- DOM 事件（可按 event_type 过滤）
SELECT DATE(d.event_time) AS stat_date, COUNT(*) AS dom_event_count
FROM t_collection_dom_events d
WHERE d.project_id = :project_id
  AND d.event_time BETWEEN :date_from AND :date_to
  /* 可选：AND d.event_type = :event_type */
GROUP BY stat_date ORDER BY stat_date;

-- 自定义事件
SELECT DATE(c.event_time) AS stat_date, COUNT(*) AS custom_event_count
FROM t_collection_custom_events c
WHERE c.project_id = :project_id AND c.event_time BETWEEN :date_from AND :date_to
GROUP BY stat_date ORDER BY stat_date;
```

SQL 示例（转化：需定义业务事件名，例如 `purchase`）
```sql
-- 转化次数
SELECT DATE(c.event_time) AS stat_date, COUNT(*) AS conversion_count
FROM t_collection_custom_events c
WHERE c.project_id = :project_id AND c.event_time BETWEEN :date_from AND :date_to
  AND c.event_name = :conversion_event_name
GROUP BY stat_date ORDER BY stat_date;

-- 转化率（转化次数 / 会话数）
SELECT t.stat_date,
       ROUND(100 * t.conversion_count / NULLIF(t.session_count, 0), 2) AS conversion_rate
FROM (
  SELECT d.stat_date,
         (SELECT COUNT(*) FROM t_collection_custom_events c
          WHERE c.project_id = :project_id AND DATE(c.event_time) = d.stat_date AND c.event_name = :conversion_event_name) AS conversion_count,
         (SELECT COUNT(*) FROM t_collection_user_sessions s
          WHERE s.project_id = :project_id AND DATE(s.start_time) = d.stat_date) AS session_count
  FROM (
    SELECT DATE(:date_from) AS stat_date
    UNION ALL SELECT DATE(:date_from) + INTERVAL 1 DAY
    /* 应用端生成日期序列，或使用辅助日期表 */
  ) d
) t
ORDER BY t.stat_date;
```

### 6.2 页面分布（饼图/柱状）
来源：t_collection_page_views

GET /api/v1/analytics/page-distribution?project_id=&event_type=&stat_date_from=&stat_date_to=&limit=&metric=

参数
- project_id: 必填
- event_type: 可选，默认 `pv`
- stat_date_from/stat_date_to: 可选，日期范围
- limit: 可选，返回前 N 名（默认 10）
- metric: 可选，`pv_count`、`event_count`（默认 `pv_count`）

SQL 示例
```sql
SELECT pv.page_url AS name, COUNT(*) AS value
FROM t_collection_page_views pv
WHERE pv.project_id = :project_id AND pv.visit_time BETWEEN :date_from AND :date_to
GROUP BY pv.page_url
ORDER BY value DESC
LIMIT :limit;
```

### 6.3 来源分布（饼图）
来源：t_collection_page_views（按 `referrer` 聚合）

GET /api/v1/analytics/referrer-distribution?project_id=&start_time=&end_time=&limit=

参数
- project_id: 必填
- start_time/end_time: 可选，时间范围（ISO 8601）
- limit: 可选，返回前 N 名（默认 10）

SQL 示例
```sql
SELECT COALESCE(pv.referrer, 'direct') AS name, COUNT(*) AS value
FROM t_collection_page_views pv
WHERE pv.project_id = :project_id AND pv.visit_time BETWEEN :date_from AND :date_to
GROUP BY name
ORDER BY value DESC
LIMIT :limit;
```

### 6.4 元素事件 Top（柱状）
来源：t_collection_dom_events（按 `element_selector`/`element_type` 聚合，可筛选 `event_type`）

GET /api/v1/analytics/dom-event-top?project_id=&event_type=&start_time=&end_time=&group_by=&limit=

参数
- project_id: 必填
- event_type: 可选，事件类型，如 `click`、`hover`（默认 `click`）
- start_time/end_time: 可选，时间范围
- group_by: 可选，`element_selector`（默认）或 `element_type`
- limit: 可选，返回前 N 名（默认 10）

SQL 示例
```sql
SELECT d.event_type,
       d.page_url,
       CASE WHEN :group_by = 'element_type' THEN d.element_type ELSE d.element_selector END AS group_key,
       COUNT(*) AS event_count
FROM t_collection_dom_events d
WHERE d.project_id = :project_id
  AND d.event_time BETWEEN :date_from AND :date_to
  /* 可选：AND d.event_type = :event_type */
GROUP BY d.event_type, d.page_url, group_key
ORDER BY event_count DESC
LIMIT :limit;
```

### 6.5 留存（折线/热力表）
来源：t_collection_users + t_collection_user_sessions（在线计算）

GET /api/v1/analytics/retention?project_id=&first_visit_date_from=&first_visit_date_to=&retention_day=

参数
- project_id: 必填
- first_visit_date_from/first_visit_date_to: 可选，首次访问日期范围（YYYY-MM-DD）
- retention_day: 可选，指定留存天数（如 1、7、30）；不传则返回 cohort 明细

SQL 示例（指定留存天数 N 的留存率）
```sql
SELECT u.first_visit_date,
       COUNT(*) AS new_users,
       COUNT(DISTINCT s.user_uuid) AS retained_users,
       ROUND(100 * COUNT(DISTINCT s.user_uuid) / COUNT(*), 2) AS retention_rate
FROM (
  SELECT project_id, user_uuid, DATE(first_visit_time) AS first_visit_date
  FROM t_collection_users
  WHERE project_id = :project_id AND first_visit_time BETWEEN :date_from AND :date_to
) u
LEFT JOIN t_collection_user_sessions s
  ON s.project_id = u.project_id
  AND s.user_uuid = u.user_uuid
  AND DATE(s.start_time) = DATE_ADD(u.first_visit_date, INTERVAL :retention_day DAY)
GROUP BY u.first_visit_date
ORDER BY u.first_visit_date;
```

SQL 示例（cohort 明细：多留存天的保留用户数）
```sql
-- 需应用端提供一个 retention_day 列表（如 1,7,30），或使用数字表
SELECT u.first_visit_date, d.retention_day, COUNT(DISTINCT s.user_uuid) AS retained_users
FROM (
  SELECT project_id, user_uuid, DATE(first_visit_time) AS first_visit_date
  FROM t_collection_users
  WHERE project_id = :project_id AND first_visit_time BETWEEN :date_from AND :date_to
) u
JOIN (
  SELECT 1 AS retention_day
  UNION ALL SELECT 7
  UNION ALL SELECT 30
) d
LEFT JOIN t_collection_user_sessions s
  ON s.project_id = u.project_id AND s.user_uuid = u.user_uuid
  AND DATE(s.start_time) = DATE_ADD(u.first_visit_date, INTERVAL d.retention_day DAY)
GROUP BY u.first_visit_date, d.retention_day
ORDER BY u.first_visit_date, d.retention_day;
```

### 6.6 指标对比（多序列折线/柱状）
来源：组合基础查询（PV/UV/会话/跳出率等）

GET /api/v1/analytics/compare?project_id=&metrics=&event_type=&page_url=&stat_date_from=&stat_date_to=

参数
- project_id: 必填
- metrics: 必填，逗号分隔多个指标（如 `pv_count,uv_count,bounce_rate`）
- event_type: 可选
- page_url: 可选
- stat_date_from/stat_date_to: 可选

SQL 提示：分别执行 6.1 中各指标的时间序列 SQL，按日期合并为多序列输出。

### 6.7 转化趋势（折线）
来源：t_collection_custom_events + t_collection_user_sessions

GET /api/v1/analytics/conversion?project_id=&page_url=&stat_date_from=&stat_date_to=&interval=

参数
- project_id: 必填
- page_url: 可选
- stat_date_from/stat_date_to: 可选
- interval: 可选，`day` 或 `hour`

响应
```
{
  "series": [
    { "date": "2025-12-23", "value": 50.00 }
  ],
  "metric": "conversion_rate"
}
```


参数
- project_id: 必填
- dimension: 必填，`platform`/`browser`/`os`
- start_time/end_time: 可选（按用户的首次/最后访问时间范围或与事件关联范围）
- limit: 可选（默认10）

SQL 示例（平台分布；按首次访问时间范围过滤）
```sql
SELECT u.platform AS name, COUNT(*) AS value
FROM t_collection_users u
WHERE u.project_id = :project_id
  AND u.first_visit_time BETWEEN :date_from AND :date_to
GROUP BY u.platform
ORDER BY value DESC
LIMIT :limit;
```

SQL 示例（浏览器/操作系统分布）
```sql
SELECT u.browser AS name, COUNT(*) AS value
FROM t_collection_users u
WHERE u.project_id = :project_id AND u.first_visit_time BETWEEN :date_from AND :date_to
GROUP BY u.browser ORDER BY value DESC LIMIT :limit;
  ## 接口使用流程（Quick Start）

  以下路径假设全局前缀为 `/api/v1`（如有不同请按实际配置）。约定：分析类接口需在 Header 传递 `X-Project-Id` 与 `X-App-Secret`。

  1. 创建项目
  - 描述：登记一个新项目（`project_id` 会自动生成）
  - 接口：POST /api/v1/collectionProject
  - 返回：包含 `id`、`project_id` 等项目信息

  2. 生成应用密钥（app_secret）
  - 描述：为指定项目生成/重置密钥，用于分析接口鉴权
  - 接口：POST /api/v1/collectionProject/{id}/generateSecret
  - 返回：`{ app_secret: '...' }`

  - 前端解密示例（获取 project_id）：
  ```js
  import CryptoJS from 'crypto-js'

  function decryptAppSecret (appSecret) {
    const salt = 'chinatelecom@web'
    const key = CryptoJS.enc.Utf8.parse(salt)
    const decrypted = CryptoJS.AES.decrypt(appSecret, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })
    return CryptoJS.enc.Utf8.stringify(decrypted)
  }

  const raw = decryptAppSecret(app_secret)
  // raw 形如：`${project_id}_${timestamp}_${random}`
  const project_id = raw.split('_')[0]
  ```

  3. 用户上报（UV/画像）
  - Upsert 用户：POST /api/v1/users
    - 关键字段：`project_id`, `user_uuid`, `first_visit_time`, 可选基础信息（`platform`/`browser`/`os`）
    - 行为：存在 `project_id+user_uuid` 则更新；否则创建
  - 查询列表：GET /api/v1/users?project_id=&platform=&start_time=&end_time=&page=&page_size=
  - 用户详情：GET /api/v1/projects/{project_id}/users/{user_uuid}
  - 更新画像/累计指标：PATCH /api/v1/projects/{project_id}/users/{user_uuid}

  4. 会话上报（Session）
  - 创建会话：POST /api/v1/sessions
    - 关键字段：`session_id`, `project_id`, `user_uuid`, `start_time`
  - 更新会话心跳/活动：PATCH /api/v1/sessions/{session_id}
    - 可选字段：`end_time`, `duration`, `page_count`, `event_count`, `exit_page`
  - 查询列表：GET /api/v1/sessions?project_id=&user_uuid=&start_time=&end_time=&page=&page_size=
  - 会话详情：GET /api/v1/sessions/{session_id}

  5. 事件采集（Events）
  - 页面访问（PV）：POST /api/v1/events/page-view
    - 关键字段：`event_id`, `project_id`, `user_uuid`, `session_id`, `page_url`, `visit_time`
  - DOM 事件：POST /api/v1/events/click
    - 关键字段：`event_id`, `project_id`, `user_uuid`, `session_id`, `page_url`, `event_type`, `event_time`
  - 自定义事件：POST /api/v1/events/custom
    - 关键字段：`event_id`, `project_id`, `user_uuid`, `session_id`, `event_name`, `event_time`

  6. 分析查询（Analytics）
  - 必需 Header：`X-Project-Id`, `X-App-Secret`
  - 趋势序列：GET /api/v1/analytics/timeseries?project_id=&metric=&interval=&date_from=&date_to=&page_url=&event_type=
  - 页面分布：GET /api/v1/analytics/page-distribution?project_id=&stat_date_from=&stat_date_to=&limit=&metric=
  - 来源分布：GET /api/v1/analytics/referrer-distribution?project_id=&start_time=&end_time=&limit=
  - 元素事件 Top：GET /api/v1/analytics/dom-event-top?project_id=&event_type=&start_time=&end_time=&group_by=&limit=
  - 留存：GET /api/v1/analytics/retention?project_id=&first_visit_date_from=&first_visit_date_to=&retention_day=
  - 指标对比：GET /api/v1/analytics/compare?project_id=&metrics=&event_type=&page_url=&stat_date_from=&stat_date_to=
  - 转化趋势：GET /api/v1/analytics/conversion?project_id=&page_url=&stat_date_from=&stat_date_to=&interval=
  - 设备/平台分布：GET /api/v1/analytics/user-distribution?project_id=&dimension=&start_time=&end_time=&limit=

  7. 安全与约定
  - `app_secret` 仅用于鉴权返回与变更，不在项目列表接口中返回
  - 客户端埋点需携带 `project_id`，并在用户/会话/事件层保持 `user_uuid`、`session_id` 的关联一致性

SELECT u.os AS name, COUNT(*) AS value
FROM t_collection_users u
WHERE u.project_id = :project_id AND u.first_visit_time BETWEEN :date_from AND :date_to
GROUP BY u.os ORDER BY value DESC LIMIT :limit;
```