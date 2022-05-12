//   #计算岛屿的最大面积 #
//    岛屿 是由一些相邻的 1 (代表土地) 构成的组合，这里的「相邻」要求两个 1 必须在 水平或者竖直的四个方向上 相邻。你可以假设 grid 的四个边缘都被 0（代表水）包围着。
//		岛屿的面积是岛上值为 1 的单元格的数目。
//		计算并返回 grid 中最大的岛屿面积。如果没有岛屿，则返回面积为 0 。


const island = [
    [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], 
    [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 0], 
    [0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
]

//
// @param {number[][]} grid
// @return {number}
// 


function getMaxArea(island){
  let max = 0
  for(let i = 0 ; i < island.length; i++) {
    let row = island[i]
    for(let j = 0; j < row.length; j++) {
      if (row[j] === 1) {
        const computed = dfs(i, j, island)
       	max = math.max(max, computed)
      }
    }
  }
}        

function dfs(i, j, island) {
  if (i < 0 || j < 0) return 0
  let count = 0
  if (island[i][j] === 1) {
    island[i][j] = 0
   	// top
  	count += dfs(i - 1, j, island)
  	// right
  	count += dfs(i, j + 1, island)
  	// bottom
  	count += dfs(i + 1, j, island)
  	// left
  	count += dfs(i, j - 1, island) 
  }
  return count
}



发布订阅与数据劫持
HTTP1.x  http2.x
作为前端开发如何主导一个项目
