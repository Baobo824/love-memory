# 🚀 GitHub Pages 部署指南

## 步骤1：准备GitHub账户

1. 访问 [GitHub.com](https://github.com) 
2. 如果没有账户，点击"Sign up"注册
3. 如果有账户，直接登录

## 步骤2：创建新仓库

1. 登录GitHub后，点击右上角的 ➕ 按钮
2. 选择 "New repository"
3. 填写仓库信息：
   - **Repository name**: `love-memory` （或你喜欢的名字）
   - **Description**: `我们的爱情纪念网页`
   - ✅ 勾选 "Public" （公开仓库才能使用免费的GitHub Pages）
   - ✅ 勾选 "Add a README file"
4. 点击 "Create repository"

## 步骤3：上传网页文件

### 方法A：使用GitHub网页界面（推荐新手）

1. 在你的新仓库页面，点击 "uploading an existing file"
2. 将以下文件拖拽到上传区域：
   - `index.html`
   - `style.css`
   - `script.js`
3. 在底部的提交信息中写：`Add love memory website`
4. 点击 "Commit changes"

### 方法B：使用Git命令行

打开命令提示符或PowerShell，执行以下命令：

```bash
# 进入项目目录
cd "C:\Users\小青\Desktop\秦皇岛"

# 初始化Git仓库
git init

# 添加所有文件
git add index.html style.css script.js

# 创建第一次提交
git commit -m "Add love memory website"

# 添加远程仓库（替换为你的GitHub用户名和仓库名）
git remote add origin https://github.com/你的用户名/love-memory.git

# 推送到GitHub
git branch -M main
git push -u origin main
```

## 步骤4：启用GitHub Pages

1. 在你的GitHub仓库页面，点击 "Settings" 选项卡
2. 在左侧菜单中找到 "Pages"
3. 在 "Source" 部分，选择：
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
4. 点击 "Save"

## 步骤5：获取网站链接

1. 等待1-2分钟让GitHub处理
2. 刷新Pages设置页面
3. 你会看到绿色的提示：
   "Your site is published at https://你的用户名.github.io/love-memory/"
4. 点击这个链接就可以访问你的网站了！

## 🎉 完成！

现在你可以将这个链接分享给任何人，他们都可以通过互联网访问你们的爱情纪念网页了！

## 📝 更新网站内容

如果以后想要更新网站：

### 通过GitHub网页界面：
1. 在仓库中点击要修改的文件
2. 点击铅笔图标编辑
3. 修改完成后点击 "Commit changes"
4. 等待1-2分钟，网站就会自动更新

### 通过Git命令：
```bash
# 修改文件后
git add .
git commit -m "Update website content"
git push
```

## 🔧 故障排除

**如果网站无法访问：**
1. 检查仓库是否为Public
2. 确认Pages设置中Branch选择的是main
3. 等待几分钟让GitHub处理
4. 确保index.html文件在根目录

**如果样式异常：**
1. 检查CSS和JS文件是否正确上传
2. 确保文件名大小写正确
3. 检查浏览器控制台是否有错误信息

## 💡 高级技巧

1. **自定义域名**：可以在Pages设置中添加你自己的域名
2. **HTTPS**：GitHub Pages自动提供HTTPS加密
3. **更新提醒**：每次推送代码后，网站会在几分钟内自动更新

---

🎊 **恭喜！你的爱情纪念网页现在可以在全世界访问了！** 🎊
