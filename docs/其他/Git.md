### Git是什么

Git是**分布式**版本控制系统，与 SVN 类似的**集中式**版本控制系统相比，集中化版本控制系统虽然能够命令多个团队成员一起协作开发，但如果中央服务器宕机的话，谁也无法在宕机期间提交更新和协同开发。

但 Git 是分布式的版本控制系统，客户端不只是提取最新版本的快照，而是将整个代码仓库镜像复制下来。如果任何协同工作用的服务器发生故障，也可以用任何一个代码仓库来恢复。而且在协作服务器宕机期间，你也可以提交代码到本地仓库，当协作服务器正常工作后，再将本地仓库同步到远程仓库。

### Git的工作流程

![git](https://user-images.githubusercontent.com/51625532/156485581-8f2e3d39-b9cd-4f6e-9329-40c2f9c50d90.png)

* workspace：工作区。工作成员进行开发时改动的地方。平常我们开发就是拷贝远程仓库的一个分支，基于该分支进行开发。在开发过程中就是对工作区的操作。
* Index：暂存区。当执行 `git add` 指令后，工作区的文件就会被移入暂存区。暂存区会记录移入文件的相关信息，不保存文件实体，通过 id 指向每个文件实体。暂存区标记了当前工作区中哪些内容是被 Git 管理的。
* Repository：本地仓库。位于自己的电脑上，通过 `git commit` 指令提交暂存区的内容，会进入到本地仓库。
* Remote：远程仓库。用来托管代码的服务器，远程仓库的内容能够被分布在多个地点的协作关系的本地仓库修改。本地仓库修改完后使用 `git push` 指令提交到远程仓库。

Git 的工作流程一般为：

* 1.在工作区修改/添加/删除文件
* 2.将工作区改动的文件放入暂存区
* 3.将暂存区的文件提交到本地仓库
* 4.将本地仓库的文件推送到远程仓库

### `.git`目录结构

Git目录 是项目存储所有历史和元信息的目录，包括所有的对象（commits、trees、blobs、tags）

每一个项目只能有一个 Git目录（这和 SVN、CVS 的每个子目录中都有此类目录相反），Git目录 是项目的根目录下名为 `.get` 的隐藏目录。

```
|—— HEAD
|—— branches
|—— config
|—— description
|—— index
|—— hooks
| |—— pre-commit.sample
| |—— pre-push.sample
| |__ ...
|—— info
| |__ exclude
|—— objects
| |__ info
| |__ pack
|__ refs
  |—— heads
  |__ tags
```

核心文件：config、objects、HEAD、index、refs
* config：存储项目的一些配置信息，比如远程的 url、邮箱、用户名等，每次在控制台使用 `git config ...` 都会对该文件产生影响。git remote add 添加的远程分支信息就保存在这里。
* objects：存储 git 对象。git 对象分为 BLOB、tree、commit 三种类型。
* HEAD：指明本地的分支结果，如本地分支是 master，那么 HEAD 就指向 master，分支在 refs 中就会表示成 `refs:refs/heads/master`。
* index：存储缓冲区（stage）的内容，也就是 add 之后保存到的区域，内容包括指向文件的时间戳、文件名、sha1等。
* refs：存储指向 branch分支 的最近一次 commit 对象的指针，也就是 commit 对象的 sha-1 值，每个分支一个文件

### Git命令

#### 工作区上的操作命令

* 新建仓库
  * 创建一个新的本地仓库：`git init`
  * 从远程克隆项目：`git clone <url>`

* 提交
  * 提交工作区所有文件到暂存区：`git add`
  * 提交工作区指定文件到暂存区：`git add <file1> <file2> ...`
  * 提交工作区某个文件夹中所有文件到暂存区：`git add [dir]`

* 撤销
  * 删除工作区文件，并且也从暂存区删除对应文件的记录：`git rm <file1> <file2>`
  * 从暂存区中删除文件，但是工作区依然有该文件：`git rm --cached <file>`
  * 取消暂存区已经暂存的文件：`git reset HEAD <file> ...`
  * 撤销上一次对文件的操作：`git checkout --<file>`
  * 储藏当前变更，以便能够切换分支：`git stash`
  * 查看当前所有的储藏：`git stash list`
  * 应用最新的储藏：`git stash apply`

* 查看更新信息
  * 查询当前工作区所有文件的状态：`git status`
  * 比较工作区中当前文件和暂存区之前的差异：`git diff`
  * 比较指定文件在工作区和暂存区上的差异：`git diff <file-name>`


#### 暂存区上的操作指令

* 提交文件到版本库
  * 将暂存区中的文件提交到本地仓库：`git commit -m 'commit-info'`
  * 将所有文件暂存后一并提交，跳过 add 到暂存区的过程：`git commit -a -m 'commit-info'`
  * 撤销上一次提交：`git commit --amend`

* 查看信息
  * 比较暂存区与上一版本的差异：`git diff --cached`
  * 比较指定文件在暂存区和本地仓库的不同：`git diff <file-name> --cached`
  * 查看提交历史：`git log`

* 分支管理
  * 创建分支：`git branch <branch-name>`
  * 切换分支：`git checkout <branch-name>`
  * 新建分支并切换到新建分支上：`git checkout -b <branch-name>`
  * 删除分支：`git branch -d <branch-name>`
  * 将当前分支与指定分支合并：`git merge <branch-name>`
  * 显示本地仓库的所有分支：`git branch`
  * 查看当前哪些分支没有合并到当前分支：`git branch --no-merged`
  * 把远程分支合并到当前分支：`git merge <remote/branch-name>`
  * 向远程分支推送内容：`git push`
  * 合并远程分支：`git pull`


#### 本地仓库上的操作指令

* 查看本地仓库关联的远程仓库：`git remote`
* 添加远程仓库：`git remote add [remote-name] [url]`
* 从远程仓库中抓取本地仓库中没有的更新：`git fetch [remote-name]`,fetch 知识将远端数据拉到本地仓库，不会自动合并到当前工作分支
* 将本地仓库分支推送到远程仓库：`git push [remote-name] [branch-name]`
* 查看远程仓库信息：`git remote show origin`
* 修改远程仓库在本地的简称：`git remote rename [old-name] [new-name]`
* 移出远程仓库：`git remote rm [remote-name]`

