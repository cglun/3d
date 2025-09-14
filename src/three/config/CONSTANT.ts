/**
 * 3D场景对象分组枚举
 * 用于在Three.js场景中对不同类型的对象进行分组管理
 */
export enum GROUP {
  MODEL = "MODEL_GROUP", // 模型分组 - 用于存储和管理3D模型对象
  HELPER = "HELPER_GROUP", // 辅助对象分组 - 用于存储和管理辅助可视化对象（如坐标轴、网格等）
  MARK_LABEL = "MARK_LABEL_GROUP", // 标记标签分组 - 用于存储和管理文本标签、标记点等
  LIGHT = "LIGHT_GROUP", // 光源分组 - 用于存储和管理场景中的各种光源
  GEOMETRY = "GEOMETRY_GROUP", // 几何体分组 - 用于存储和管理基础几何体对象
  BOX = "BOX_HELPER", // 盒子辅助器分组 - 用于存储和管理边界框辅助器
  ENV = "_ENV_", // 环境分组 - 用于存储和管理环境相关对象
  ROAM = "_ROAM_", // 漫游分组 - 用于存储和管理与漫游相关的对象
  TEST = "TEST_GROUP", // 测试分组 - 用于测试用途的临时对象
  NONE = "NONE", // 无分组 - 不归属任何特定分组的对象
  TILES = "TILES_GROUP", // 瓦片分组 - 用于存储和管理瓦片地图相关对象
  EMERGENCY_PLAN = "EMERGENCY_PLAN_GROUP", // 应急预案分组 - 用于存储和管理应急预案相关的3D对象
}
