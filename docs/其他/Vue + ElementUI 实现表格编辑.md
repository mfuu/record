## 预览

暂无图片

## 实现

### `Table.vue`组件部分代码

```vue
<template>
  <el-table
    ...
    @cell-click="handleCellClick"
    @cell-dblclick="handleCellDblClick
  >
  </el-table>
</template>

<script>
import { cellOprate } from './extends/index.js'
export default {
  props: {
    columns: {}
  },
  data() {
    return {
      clickTimer: null
    }
  },
  methods: {
    handleCellClick(row, column, cell) {
      clearTimeout(this.clickTimer)
      const col = this.getOriginColumn(column) // 获取 props.columns 中对应的 column
      if (!col.markable) return // 通过 markable 字段控制是否可以单击操作
      this.clickTimer = setTimeout(() => {
        // 鼠标单击事件
        this.handleCellOprate('mark', row, column, cell)
      }, 250)
    },
    handleCellDblClick(row, column, cell) {
      clearTimeout(this.clickTimer)
      const col = this.getOriginColumn(column) // 获取 props.columns 中对应的 column
      if (!col.editable) return // 通过 editable 字段控制是否可以双击编辑
      this.handleCellOprate('input', row, column, cell)
    },
    handleCellOprate(type, row, column, cell) {
      const cellNode = cell.children[0]
      const cellValue = row[column.property] // 获取对应数据
      new cellOprate({
        propsData: {
          type,
          cellValue,
          styles: { width: cellNode.style.width }, // 只需要获取宽度
          classList: cellNode.getAttribute('class')
          onInputBlur: (oldVal, newVal) => {
            // 输入框失焦时触发
          }
        }
      })
    }
  }
}
</script>
```

### `extends`各组件代码

#### `extends/index.js`

```js
import Vue from 'vue'
import definedMark from './Mark.vue'
import definedSpan from './Span.vue'
import definedInput from './Input.vue'
import definedOprate from './Oprate.vue'

export const cellMark = Vue.extend(definedMark)
export const cellSpan = Vue.extend(definedSpan)
export const cellInput = Vue.extend(definedInput)
export const cellOprate = Vue.extend(definedOprate)
```

#### `extends/Oprate.vue`

```vue
<template>
  <Span
    v-if="type === 'span'"
    :propsData="propsData"
    @changeType="handleChangeType"
  />

  <Input
    v-else-if="type === 'input'"
    :propsData="propsData"
    @blur="handleInputBlur"
  />

  <Mark
    v-else-if="type === 'mark'"
    :propsData="propsData"
    @changeType="handleChangeType"
  />
</template>

<script>
import Span from './Span.vue'
import Mark from './Mark.vue'
import Input from './Input.vue'
export default {
  components: { Span, Mark, Input },
  props: ['type', 'styles', 'classList', 'cellValue', 'onInputBlur'],
  data() {
    return {

    }
  },
  computed: {
    propsData() {
      return {
        styles: this.styles,
        classList: this.classList,
        cellValue: this.cellValue
      }
    }
  },
  methods: {
    // 输入框 blur 回调
    handleInputBlur(oldVal, newVal) {
      if (typeof this.onInputBlur === 'function') this.onInputBlur(oldVal, newVal)
    },
    // 改变当前显示组件
    handleChangeType(value) {
      this.type = value
    }
  }
}
</script>
```

#### `extends/Span.vue`

```vue
<template>
  <!-- el-table 中默认使用 div 渲染的内容，这里也使用div -->
  <div
    :style="propsData.styles"
    :class="propsData.classList"
    @click.stop="handleClick" // 防止触发 el-table 的 cell-click 事件
    @dblclick.stop="handleDblClick" // 防止触发 el-table 的 cell-dblclick 事件
  >
    {{ propsData.cellValue }}
  </div>
</template>

<script>
export default {
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {
          styles: '',
          classList: '',
          cellValue: ''
        }
      }
    }
  },
  data() {
    return {
      clickTimer: null
    }
  },
  methods: {
    handleClick() {
      clearTimeout(this.clickTimer)
      this.clickTimer = setTimeout(() => {
        this.$emit('changeType', 'mark') // 与 cell-click 逻辑对应
      }, 250)
    },
    handleDblClick() {
      clearTimeout(this.clickTimer)
      this.$emit('changeType', 'input') // 与 cell-dblclick 逻辑对应
    }
  }
}
</script>
```

#### `extends/Input.vue`

```vue
<template>
  <el-input
    ref="cellInput"
    v-model="value"
    class="table-cell__input"
    @blur="handleBlur"
    @click.stop.native // 防止触发 el-table 的 cell-click 事件
    @dblclick.stop.native // 防止触发 el-table 的 cell-dblclick 事件
  />
</template>

<script>
export default {
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {
          cellValue: ''
        }
      }
    }
  },
  data() {
    return {
      value: ''
    }
  },
  created() {
    this.value = this.propsData.cellValue
  },
  mounted() {
    // 默认聚焦
    this.$refs.cellInput.focus()
  },
  methods: {
    handleBlur() {
      this.$emit('blur', this.propsData.cellValue, this.value)
    }
  }
}
</script>
```

#### `extends/Mark.vue`

```vue
<template>
  <el-popover
    ref="cellPopover"
    v-model="visible"
    popper-class="table-cell__popover"
    @hide="handlePopoverHide"
    @click.stop.native // 防止触发 el-table 的 cell-click 事件
    @dblclick.stop.native // 防止触发 el-table 的 cell-dblclick 事件
  >
    <el-input
      ref="cellMark"
      v-model="mark"
      type="textarea"
      placeholder="输入内容"
      @click.stop.native // 防止触发 el-table 的 cell-click 事件
      @dblclick.stop.native // 防止触发 el-table 的 cell-dblclick 事件
    />
    <el-button @click.stop.native="handleclick">确定</el-button>

    <div
      slot="reference"
      :style="propsData.styles"
      :class="propsData.classList"
    >
      {{ propsData.cellValue }}
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    propsData: {
      type: Object,
      default: () => {
        return {
          styles: '',
          classList: '',
          cellValue: ''
        }
      }
    }
  },
  data() {
    return {
      mark: '',
      visible: true // 默认加载组件时显示气泡
    }
  },
  methods: {
    handleclick() {
      this.$emit('changeType', 'span')
    },
    handlePopoverHide() {
      this.$emit('changeType', 'span')
    }
  }
}
</script>
```
