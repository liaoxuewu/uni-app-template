/**
 * @Description:
 * @Author liaoxuewu
 * @create 2022/4/12 21:54
 */
const files = require.context('.', false, /\.js$/)
const modules = []

files.keys().forEach(key => {
  if (key === './index.js') return
  const item = files(key).default
  modules.push(...item)
})

export default modules
