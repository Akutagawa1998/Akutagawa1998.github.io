# Kiwi 逐帧动画组件：前端接入说明（v3：固定构图与节奏修订）

## 英文主界面与新图标套件

当前主文档为 [English README](README.md)。预览页默认全英文；“Chinese hints” 默认关闭，开启后仅增加中文辅助提示，英文标题、控件、状态和可访问名称继续作为主界面。

新增静态套件共 45 项：2 个品牌 SVG、24 个功能 SVG、19 个 Kiwi 姿态 PNG。清单为 `public/kiwi-icons/manifest.json`；图标区支持搜索、分类、尺寸、背景、源文件下载，以及 SVG 的 256px PNG 导出。`KiwiIcon` 的功能符号使用 `currentColor`，姿态 PNG 保持原绘制颜色。

下载“Full frontend kit”后先读 `START-HERE.txt`，运行：

```sh
npm install
npm run dev
npm run check
npm run build
```

下载的最小 ZIP 只包含这组脚本，没有 `mascot:build` 或素材再生成脚本。以下旧说明中的 `mascot:*` 命令用于完整 kiwi-ui 仓库。完整仓库新增 `npm run mascot:build`，输出 `dist-mascot/`，默认部署在 `/kiwi-icon/`，并包含两份 README 和完整前端 ZIP；链接按 `import.meta.env.BASE_URL` 解析。

图标区的“Download kit .zip”是静态图标包（`kiwi-icons/kiwi-icon-kit.zip`）；页面接入区的“Full frontend kit”是包含 React 组件、预览和动静态素材的完整包（`kiwi-icon-kit.zip`）。

```tsx
import { KiwiIcon } from './components/KiwiIcons';
import { IconLibrary } from './components/KiwiIcons/IconLibrary';
<KiwiIcon name="chat" size={24} decorative />
<KiwiIcon name="book" size={32} title="Learning materials" />
<IconLibrary showChineseHints={false} />
```


新版按用户的明确要求使用**逐帧绘制的图像序列**。角色的动作姿态来自已绘制画帧，播放器切换实际图像；不再通过旋转、拉伸或位移一张不变的 SVG 来模拟角色动作。预览保留原来的奶油色、鼠尾草绿、森林绿页面，并提供固定镜头、坐标辅助线和双帧比较。

造型沿用用户选定的 **P2 侧面应用图标**与 **P3 正面聊天肖像**：圆润森林绿轮廓、细长米色嘴、奶油色眼睛，克制而有一点笨拙的表情。素材由图像生成工具参考用户提供的形象绘制，再整理为本地帧资源；不是人工手绘证明，也不包含导入的 Suica 商标或角色源文件。

v1 的 SVG 变换方案被用户否定；v2 虽改为图像帧，用户又指出位置漂移和抽搐。v3 修订的是**源画帧的固定构图登记、每张画帧的曝光时长、动作往返接缝以及中途反向衔接**，不是只把 fps 数字调低。旧说明保存在 v1 快照 (full repository: `README.v1-superseded.md`)与 v2 快照 (full repository: `README.v2-superseded.md`)，以前的检查记录保留为历史证据。当前参数来自 `KIWI_FRAME_ANIMATIONS`；视觉验收仍以当前播放观察和用户确认作为依据。

## 看效果与检查每一帧

```sh
npm install
npm run mascot:preview
```

或运行 `npm run dev`，打开 **http://localhost:3001/mascot-preview.html**。独立入口仅加载本地 React、字体、组件与帧素材，不需要登录或后端。

主舞台支持选择动作、重播、暂停和减少动态。检查器查看当前图集的全部画帧；场景播放可能只使用其中的一段，并按配置倒放或重复停留。点击“逐帧检查”、拖动整数滑块、按上一帧/下一帧，或点击画帧缩略图，舞台会停在对应的真实画帧；点击重播恢复完整动作。缩略图不是实时截图，也不是从同一张图变形出的过渡。可以直接检查轮廓、长嘴、眼睛、脚步、翅膀和前后帧衔接。

构图检查新增“构图辅助线”和“双帧比较”。主舞台保持 240 × 240 px 镜头；辅助线画在格子边界、X=50% 与 Y=90.625%，标记源画布坐标。256px 源画布上，Y 参考线为 232；它用于观察肖像/挥手的胸底与落地参照；loader 的新小跳名义脚底参照另为 Y=222，并非每帧绝对一致。辅助线不会移动角色。固定当前帧后，再拖动滑块，参照帧不会跟着变化；两帧使用同样大小的镜头，窄屏下同步缩小。预览显示已经登记好的固定画格，不按单帧包围盒实时重新居中，不在两帧之间做透明叠加。重播或退出手动检查会关闭比较模式。

加载演示仍然区分未知时长与真实进度。stamp 可以悬停探头、点击打开本地示例对话、收起并归还焦点。所有示例都受全局动画模式控制；逐帧检查属于手动查看，不自动播放。

`npm run storybook` → **Kiwi Design System / Components / Kiwi Mascot** 包含公共参数、动作画廊、逐帧检查、加载、stamp、减少动态、小尺寸和暗色表面。公共行为约定在 catalog.json (full repository: `../../.storybook/design-system/catalog.json`)，具体实现以 组件入口 (full repository: `../../src/components/KiwiMascot/index.ts`)及其导出的帧元数据为准。

## 目录与资源

| 路径 | 用途 |
| --- | --- |
| `src/components/KiwiMascot/index.ts` | `KiwiMascot`、`KiwiLoader`、`KiwiStamp`、状态类型与帧元数据的公共入口 |
| `src/components/KiwiMascot/` | 帧播放器、动作配置、可见性/减少动态处理、组件样式 |
| `public/kiwi-mascot/frames-v3/` | 当前图集的透明 PNG、浏览器用的无损 WebP、独立 PNG 帧与 manifest；部署时一起发布 |
| `public/kiwi-mascot/kiwi-{icon,portrait,full}.svg` | 保留的三种静态品牌标识；不用于模拟新版角色动画 |
| `src/components/KiwiMascot/frames.ts` | 每个场景使用的图集、格数、fps、循环与实际播放索引序列 |
| `branding/kiwi-mascot/` | 接入说明、素材制作记录与参考信息 |
| `mascot-preview.html`、`src/mascot-preview.*` | 保持原呈现方式的独立预览入口 |
| `.storybook/stories/KiwiMascot.stories.tsx` | 可调公共参数与逐帧交互示例 |
| `README.v1-superseded.md`、`README.v2-superseded.md` | 已被取代的技术说明，仅供历史追溯 |
| `public/kiwi-mascot/frames-v3/registration.json` | 源文件 hash、整数裁切矩形、固定画布粘贴坐标与锚点记录 |

图集采用 **6 列 × 4 行**，每格 **256 × 256 px**。例如 `frames-v3/portrait-turn.png` 是登记后的转头图集，`portrait-turn.webp` 是播放器读取的无损 WebP；`frames-v3/portrait-turn/frame-000.png` 到 `frame-023.png` 是可单独查看的裁切画帧。行走图集对应 `full-walk`。完整清单在 `frames-v3/manifest.json`。

当前配置包含 **8 张活动图集 × 24 格 = 192 个源画帧**，组织为 19 个场景片段。5 张登记自保留的 v2 源绘制；3 张在 v3 重新绘制：`portrait-doze`（渐进闭眼）、`stamp-peek`（无杆、短颈的半头到完整头探出）和 `full-hop-flight`（幅度克制的蹲伏、小跳与短翅动作）。活动图集为 `portrait-turn`、`portrait-nod-sleep`、`portrait-blink`、`full-walk`、`full-hop-flight`、`full-wave-bow`、`portrait-doze`、`stamp-peek`。复用、倒放、曝光与停留由 `sequence` 显式记录，不能说成 19 套独立重画动画。

源 PNG 保持不变，v2 原始目录与证据继续保留。`registration.json` 对每格记录 `isolationRect` 和 `targetPaste`：打包时按全局源坐标隔离当前角色，再把原像素以 **1:1** 放入透明 256px 画格。不 resize、不 rotate、不做跨帧溶解、不合成中间姿态。运行时只切换这些已经登记的画格。

登记参考按动作区分：肖像胸底基线 Y=232、基底 X≈112；行走稳定主眼 X 和头部 Y，保留约 1px 的步态上下节律；挥手/鞠躬以落地基线 Y=232 为参照，并为长嘴保留边界；新小跳按照登记的主眼轨迹安排轻微下蹲、腾空和落地（目标眼 Y 约 105→116→70→115→105），保留各张画帧中的腿与短翅姿态，loader 使用名义站立脚底 Y=222 作为落地参照；个别画帧在 64px 显示下仍有约 0.75px 的脚部变化。探头固定右边界 X=220 与冠顶 Y=70；胸底约 Y=206..230 的变化来自头部逐渐露出，不作为固定站立基线。

三种构图名保留兼容：`portrait` 用于聊天头像，`icon` 用于应用标识/收起入口，`full` 用于全身动作。每个状态使用哪个绘制序列、具有多少实际帧，见对应的 `KIWI_FRAME_ANIMATIONS[state]`。不要把换一个 `variant` 当作重新生成一套不存在的画帧。

## 最小 React 接入

```tsx
import { KiwiMascot, KiwiLoader, KiwiStamp } from './components/KiwiMascot';

// 旁边已有状态文字，图像保持装饰性即可。
<div className="chat-status">
  <KiwiMascot state="thinking" variant="portrait" size={48} />
  <span role="status">Kiwi 正在思考…</span>
</div>

// 没有相邻文字的独立图像应给出可访问名称。
<KiwiMascot state="listening" size={48} decorative={false} label="Kiwi 正在倾听" />

// 未知时长：行走、跳跃，到终点尝试飞起来。
<KiwiLoader width={240} label="正在整理课程材料" />

// 0..1，仅传后端或实际任务的真实进度。
<KiwiLoader width={240} progress={0.56} label="正在整理课程材料 · 56%" />

// 点击/Enter/Space 时同步执行宿主操作。
<KiwiStamp size={64} label="打开 Kiwi 聊天" onActivate={openChat} />
```

组件入口自动引入样式，但帧图像属于 public 资源。复制到其他 React 项目时要同时复制组件目录与 `public/kiwi-mascot/frames-v3/` 及静态图标。为头像预留固定大小的框，避免状态切换改变消息行布局。

## 公共参数

### `KiwiMascot`

| 参数 | 类型 / 默认值 | 含义 |
| --- | --- | --- |
| `state` | `KiwiState` / `idle` | 下表中的动作状态 |
| `variant` | `portrait \| full \| icon` / `portrait` | 构图请求；实际可用画帧以配置为准 |
| `size` | `number` / `48` | 外框宽高，CSS px |
| `frame` | `number \| undefined` / 未指定 | 可选的 **0 起算整数帧号**；指定时停止自动播放，约束到有效范围 |
| `motion` | `auto \| reduced \| paused` / `auto` | 系统偏好、减少动态或暂停 |
| `decorative` | `boolean` / `true` | 装饰性时隐藏于无障碍树；否则使用 `role="img"` |
| `label` | `string` / `Kiwi` | 独立图像的可访问名称 |
| `className`、`style` | 标准 React 样式参数 | 宿主布局 |
| `onAnimationComplete` | `() => void` | 单次完整动作结束一次；循环不调用 |

手动帧优先于自动/减少动态的默认静态帧选择。因此即使系统开启减少动态，仍能检查第 2、第 3 等画帧；检查本身不会形成动画。显示手动帧不代表一个完整动作已播放完，不应用它触发业务完成。

### `KiwiLoader`

| 参数 | 类型 / 默认值 | 含义 |
| --- | --- | --- |
| `progress` | `number \| undefined` / 未指定 | 未指定或非有限数为未知进度；有限值约束到 0..1 |
| `label` | `string` / `Kiwi is thinking…` | 可见文字与可访问名称；中文界面请传中文 |
| `width` | `number` / `200` | 目标宽度，同时不超过父容器 |
| `motion` | 同上 / `auto` | 动画模式 |

未知进度使用 `role="status"`。到了终点扇翅再回到起点是循环故事，**不代表任务完成，也不生成百分比**。真实进度使用 `role="progressbar"`，`aria-valuenow` 为 0..100。宿主在真实任务结束后移除 loader 或改为结果界面。

### `KiwiStamp`

| 参数 | 类型 / 默认值 | 含义 |
| --- | --- | --- |
| `size` | `number` / `64` | 内部图像大小；按钮命中区至少 44 × 44 px |
| `label` | `string` / `Open Kiwi Chat` | 原生按钮的 `aria-label` |
| `motion` | 同上 / `auto` | 动画模式 |
| `onActivate` | `() => void` | 点击、Enter、Space 激活时立即通知宿主 |
| `disabled` | `boolean` / `false` | 原生禁用状态 |
| `className`、`style` | 标准 React 样式参数 | 宿主定位和布局 |

初始安静等待，hover/focus 播放短颈探头序列，离开且失焦后按当前画帧反向缩回；点击立即打开宿主面板，并复用新绘制的小跳序列播放跳出。触屏不依赖 hover。角色的可见姿态由画帧表达，交互不等待素材播完才响应。

## 动作选择

状态命名保持前端接入兼容。帧数、fps、时长与循环属性来自实际配置，不在文档中手填一套可能过时的数字。

| 状态 | 用途 |
| --- | --- |
| `idle` | 安静呼吸、眨眼，等待输入 |
| `thinking` | 侧头思考，等待模型或工具 |
| `listening` | 接收用户输入、倾听 |
| `speaking` | 实际文字/音频输出阶段 |
| `walk` | 迈步前进、处理过程 |
| `hop` | 蓄力、跳跃、落地 |
| `fly` | 短翅努力尝试飞起来 |
| `success` | 真实任务完成后的单次庆祝 |
| `error` | 失败反馈，配可读错误与恢复操作 |
| `offline` | 已确认离线时等待连接 |
| `sleep` | 空闲或休眠 |
| `wave` | 招呼、重新打开聊天 |
| `bow` | 致意、感谢 |
| `curious` | 好奇、新发现 |
| `heart` | 用户主动点赞/感谢 |
| `notification` | 收到实际提醒后转头回应，再回正 |
| `peek` | 边缘探头并对视 |
| `retract` | 缩回、继续等待 |
| `pop` | 接到邀请后跳出来 |

程序可以直接生成真实参数表：

```tsx
import { KIWIMASCOT_STATES, KIWI_STATE_META, KIWI_FRAME_ANIMATIONS } from './components/KiwiMascot';

console.table(KIWIMASCOT_STATES.map(state => ({
  state,
  frames: KIWI_FRAME_ANIMATIONS[state].frameCount,
  timelineHz: KIWI_FRAME_ANIMATIONS[state].fps,
  timelineSteps: KIWI_FRAME_ANIMATIONS[state].sequence.length,
  usedDrawings: new Set(KIWI_FRAME_ANIMATIONS[state].sequence).size,
  loop: KIWI_FRAME_ANIMATIONS[state].loop,
  durationMs: KIWI_STATE_META[state].durationMs,
  variant: KIWI_FRAME_ANIMATIONS[state].variant,
})));
```

`frameCount` 是图集格数；`sequence` 是实际播放顺序，重复同一整数意味着在该画帧停留。时长为 `sequence.length / fps` 秒，因此不能只用图集格数计算动作时长。

`fps` 字段保留 API 兼容名，在 v3 表示 **24 Hz 的时间线时钟**。同一画帧可以占 2、3 或更多时隙；它不表示每秒必须切换 24 张不同图，也不等于显示器刷新率或测得的设备帧率。渲染阻塞可能跳过时隙。播放连贯性仍需要检查实际素材、曝光节奏和循环接缝。

关键场景的当前配置如下；更改源码后以元数据重新导出为准：

| 场景 | 画帧曝光与停留 | 完整时间线 |
| --- | --- | ---: |
| `walk` | 每张画帧占 2 时隙，24 格形成双步态 | 48 / 24 = 2 秒 |
| `hop` | 新小跳图集，每张画帧占 3 时隙，落地末帧停 12 时隙 | 84 / 24 = 3.5 秒 |
| `pop` | 复用新小跳 0..23，每帧 2 时隙，末帧停 12 时隙 | 60 / 24 = 2.5 秒 |
| `thinking` | 转向、端点停留、沿相邻画帧返回 | 213 / 24 = 8.875 秒 |
| `sleep` | 渐进闭眼约 3 秒、闭眼停留 6 秒，再渐进睁眼 | 333 / 24 = 13.875 秒 |
| `notification` | 转头回应、停留、回正 | 117 / 24 = 4.875 秒 |
| `bow` | 14..17 缓慢低头、停留，再 16..14 抬头 | 64 / 24 ≈ 2.667 秒 |
| `heart` | 同一低头/抬头片段，延长谢意停留 | 88 / 24 ≈ 3.667 秒 |
| `peek` | 半头到完整头，每格 2 时隙并保留端点停留 | 56 / 24 ≈ 2.333 秒 |
| `retract` | 完整探头时间线的精确反序，包含停留 | 56 / 24 ≈ 2.333 秒 |

鞠躬与谢意片段不再经过旧图集 18→19 的突变接缝，而是从相邻姿态低头后原路抬头。旧跳跃图集的翼形突缩、旧 stamp 跳出的眼部位置突跳，则通过新绘制的小跳源替代；`pop` 不再使用旧 `stamp-peek-pop` 图集。旧源和旧证据保留，不进入当前活动序列。

探头中途离开时，从用户实际看到的当前画帧继续反向，避免先跳到“完整探头”再缩回；重新进入也从当前画帧接续。中途片段的剩余时长会短于表中的完整动作。loader 当前故事为 244 时隙 / 24 Hz ≈ 10.167 秒，路径运动与角色画帧分开处理，不把它当作后台任务完成进度。小跳绘制为 64px 时，画面 Y=14.5 加上名义脚底 222×64/256，对应 canvas 地面 Y=70；该值是布局参照，个别画帧脚部仍有约 0.75px 变化，不要在换素材后沿用未经核对的落地偏移。

## 自己做一个逐帧检查器

```tsx
import { KiwiMascot, KIWI_FRAME_ANIMATIONS, kiwiSceneDrawings } from './components/KiwiMascot';

const state = 'thinking';
const sequence = KIWI_FRAME_ANIMATIONS[state];
const drawings = kiwiSceneDrawings(state);
const [index, setIndex] = useState(0);

<KiwiMascot state={state} variant={sequence.variant} frame={drawings[index]} size={192} />
<input
  type="range"
  min={0}
  max={drawings.length - 1}
  step={1}
  value={index}
  aria-label="选择动画帧"
  onChange={event => setIndex(Number(event.target.value))}
/>
```

预览中的帧号从 0 起算，按场景实际播放顺序排列，并省略连续重复的停留。使用 `kiwiSceneDrawings(state)[index]` 获取对应的图集格号；`frame` 属性仍然接收图集格号。Peek out 的第 0 帧是图集 0（半头），Tuck away 的第 0 帧是图集 23（完整探头），后者精确倒放前者。切换动作时把预览步号重置到 0。取消手动检查时不传 `frame`。需要从头重播时改变 React `key`，不要通过重载整页解决。

## 请求生命周期、流式输出与中断

请求状态驱动画面，不用动画推断请求结果。等待模型或工具执行时用 `thinking`，实际 token/音频输出用 `speaking`，结束后回到 `idle`。只在明确的成功事件上庆祝一次，不为每个 token 或每条历史消息庆祝。

```tsx
type RequestPhase = 'idle' | 'waiting' | 'streaming' | 'complete' | 'failed' | 'offline';
const avatarState = {
  idle: 'idle', waiting: 'thinking', streaming: 'speaking',
  complete: 'idle', failed: 'error', offline: 'offline',
} as const;
<KiwiMascot state={avatarState[phase as RequestPhase]} size={32} />
```

取消时先停止宿主请求/工具，再切回 `idle`。状态切换替换旧序列。失败时保留已输出内容，显示文字与重试按钮；只有检测到真实离线才用 `offline`。

```tsx
<KiwiMascot
  key={`${completedTaskId}:success`}
  state="success"
  size={96}
  onAnimationComplete={() => {
    setPhase(previous => previous === 'complete' ? 'idle' : previous);
  }}
/>
```

循环动作不触发完成回调；有限动作只触发一次。减少动态不会要求用户等待一段不可见动画。暂停或不可见时冻结播放，不让一个隐藏动画替宿主声称任务完成。业务打开操作放在 `onActivate`，不放在角色播放结束回调中。

## 本仓库现有 UI 接线

- `src/components/Chat/ChatMessages.tsx`：助手头像 32 px；typing/工具执行/agent step 映射 `thinking`，实际流式状态映射 `speaking`，错误映射 `error`，其余 `idle`。
- `src/components/Loader/Loader.tsx`：共享加载组件继续沿用原调用入口，内部使用 `KiwiLoader`。
- `src/components/GlobalChat/GlobalChatButton.tsx`：原有 MUI 浮动入口内使用 Kiwi，hover/focus 探头，leave/blur 缩回，点击立即打开并播放跳出。原有拖动、吸附、位置存储、badge 和布局仍由宿主管理。

这些是 UI 状态映射，不表示新增后端能力、原生系统最小化 API 或真实服务端会话验证。实际通过的检查以当前 v3 交付记录为准；v2 检查只证明当时的版本。

## 暂停、系统偏好与键盘

`auto` 监听 `prefers-reduced-motion`。`reduced` 使用稳定画帧，保留文字和真实进度。`paused` 冻结当前帧时间线；点击与键盘操作仍立即响应。浏览器标签页不可见或角色离开视口时，自动暂停当前播放。大画廊建议只让选中动作播放，其余显示静态帧。

stamp 使用原生按钮，保留可见焦点、44 px 最小命中区、Enter/Space 和 disabled 语义。打开聊天后，宿主把焦点移到面板入口；关闭后回到 launcher。Escape 行为由面板实现；预览的 mock chat 只是非模态本地示例。

旁边已有文字时保留 `decorative=true`；独立图像设置 `decorative=false` 和描述含义的 `label`。错误不能只靠姿态表达；进度播报需要节流，不要逐帧更新 assertive live region。

## 构建、资源路径与其他框架

```sh
npm run build
npm run preview
```

Vite 同时构建 `index.html` 和 `mascot-preview.html`。独立预览部署到 `站点/mascot-preview.html`，`public/kiwi-mascot/` 随构建复制到 `dist/kiwi-mascot/`。不要只部署 JS 而遗漏帧素材。预览用 `import.meta.env.BASE_URL` 处理子路径，宿主复制组件时也应保留相同的资源根路径策略。

静态品牌图标可继续使用同目录下的 `kiwi-icon.svg` / `kiwi-portrait.svg` / `kiwi-full.svg`；这些是静态标识，不是新版逐帧动画。

```tsx
<img
  src={`${import.meta.env.BASE_URL}kiwi-mascot/kiwi-portrait.svg`}
  width={48}
  height={48}
  alt="Kiwi"
/>
```

Vue/Svelte/原生 HTML 可复用透明 PNG / 无损 WebP 图集、独立 PNG 帧和动作配置，在自己的播放器中按整数帧索引显示对应图像。不要复制 v1 SVG 的 transform 关键帧作为当前动画。播放器至少应处理帧顺序、时钟、循环/单次、取消、暂停、系统减少动态以及资源加载失败；stamp 另需处理 hover/focus、离开、激活与禁用。复制一个 PNG 或静态 SVG 不会得到完整动作。

还提供 `frames-v3/kiwi-{state}.webp`（19 个动作的透明动画 WebP），可直接用于 `<img>`。图像内播放不提供 React 完成回调、暂停或系统减少动态处理；宿主需要根据减少动态偏好切换到对应独立静态 PNG。复杂交互优先使用组件。深色表面建议给森林绿角色加奶油色底托，保持轮廓可见；预览的深色示例采用这一方式。

修改播放顺序之后运行 `npm run mascot:frames:manifest`；素材打包运行 `npm run mascot:frames:pack`（Python + Pillow）。仅重打包一个动作可用 `npm run mascot:frames:pack -- --only hop`。打包脚本校验源 SHA256，按登记的整数源矩形裁切并粘贴到固定画格，再无损编码和排列已有绘制帧；不补画、不插值、不重着色。源 hash 不符时必须重新测量登记，不能静默接受漂移来源。提示词分别保存在 `branding/kiwi-mascot/prompts-v2/` 与 `prompts-v3/`，原始 PNG 保留。

Next.js App Router 接入需要客户端边界（例如 wrapper 的 `'use client'`），浏览器偏好监听和交互组件不能当作纯服务器组件。由宿主安排 CSS 导入并保证帧资源路径正确。

## 系统 Dock / 托盘的边界

这里的 stamp 是**网页内收起聊天后的入口**。真正最小化的窗口不接收该页面的 hover；浏览器组件不能直接控制 macOS Dock 或 Windows 托盘。

Electron/Tauri 可在仍可见的小窗口中放置该组件，把 `onActivate` 接到已授权的恢复窗口 API。系统托盘/Dock 仍需原生宿主的图片和事件机制，以及独立的透明窗口、命中区、置顶、跨屏与焦点验证。这套帧素材不自动授予系统权限或新增后台驻留机制。

## 本轮核验

v3 已完成源码与素材技术核验：最终全套测试 80 文件 / 754 项通过，相关组件 7 文件 / 71 项通过；语义 TypeScript 检查、生产构建、Storybook 构建通过。预览热更新入口会清理旧 React root，修正重复挂载警告；修改后生产构建再次通过。

`artifacts/kiwi-mascot-v3-2026-10-14/asset-checks.json` 记录 8 张活动图集、192 个独立 PNG、27 个 WebP（8 张图集 + 19 个动画），并核对源 hash、帧隔离/边界、精确反序探头及编码时长。实际浏览器截图 `peek-comparison.jpg` 比较同一镜头的探头第 1 / 24 帧；固定相机 UI 也在 320px 窄屏检查过。此处的通过指具体实现与已记录观察，艺术审批、完整设备矩阵和推送仍未完成。

## 素材迭代与交付记录

重新绘制时应保持相同角色比例、长嘴方向、眼睛位置、描边/色块处理、透明边界与画布锚点。检查每帧之后还要看顺序播放和循环首尾；仅有一张漂亮的 contact sheet 不证明动作连贯。帧裁切/重排和播放速率调整不能被描述为新增了实际绘制帧。

图像来源、整理方法、实际画帧数、复用关系、观察结果和限制应写入 v3 交付记录；不要把旧测试、新代码构建成功或目标 fps 当成美术质量验证。参考图与历史证据不覆盖。推送/发布仍等待用户批准。

独立预览不发起模型调用、上传课程材料或引入遥测；帧素材为本地文件。运行时的生产聊天网络请求仍属于宿主应用。

## 2026-10-14：探头起始姿态与圆形展示

收起聊天后的静止按钮使用 `stamp-peek` 的第 0 格（墙边半头），不再显示 P2 应用图标；应用标识本身保持不变。动作卡片和 Peek/Tuck 静态 PNG 使用对应动作的起始姿态。

`KiwiMascot` 新增 `framing="circle"`，适合带圆底的头像。每张图集统一计算一次固定大小和偏移，覆盖全部 24 个画帧并保留圆周留白；播放中不逐帧重定位，跳跃的原始竖直变化也保留。默认 `framing="source"` 使用原始方形画布。此改动只调整展示布局，不改写素材像素。

主预览、顶部头像和深色样例使用圆形适配。点击 **Source canvas & guides** 可查看原始画布；并排比较始终使用原始画布。`artifacts/kiwi-framing-2026-10-14/verify-circle-fit.py` 校验所有非透明像素的四角均在圆内。
