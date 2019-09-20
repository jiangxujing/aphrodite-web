<template>
	<div class="categoryManagement">
		<div>
			<div>
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="名称：">
						<el-input v-model="name" placeholder="请输入内容" clearable @clear="cleanData">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="onSearch" type="green">查询</el-button>
						<el-button @click="onAdd" type="green">新增</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column prop="name" label="Pool名称" align="center">
					</el-table-column>
					<el-table-column prop="description" label="文件名称" align="center">
					</el-table-column>
					<el-table-column prop="operator" label="操作人" align="center">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" align="center" :formatter="$utils.dateFormat">
					</el-table-column>
					<el-table-column prop="updateTime" label="修改时间" align="center" :formatter="$utils.dateFormat">
					</el-table-column>
					<el-table-column align="center" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" size="small" @click="build(scope.row)">调试</el-button>
							<el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
							<el-button type="text" size="small" @click="deleteFun(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage4" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total, sizes, prev, pager, next, jumper" :total="total">
				</el-pagination>
			</div>
		</div>
		<div class="wrapper" v-show="boxShow" @click="boxShow = false">
			<div class="editbox" @click.stop style="width:1000px">
				<el-row>
					<el-col :span="4" class="search-label"><span class="red">*</span><span class="label">名称：</span></el-col>
					<el-col :span="4">
						<el-input v-model="objName" clearable placeholder="名称"></el-input>
					</el-col>
				</el-row>
				<!--<el-row>
					<el-col :span="4" class="search-label"><span class="red">*</span><span class="label">Obj文件：</span></el-col>
					<el-col :span="4">
						<el-input v-model="objFile" clearable placeholder="Obj文件"></el-input>
					</el-col>
				</el-row>-->
				<el-row>
					<el-col :span="4" class="search-label"><span class="label">Obj文件：</span></el-col>
					<el-col :span="8">
						<el-upload class="upload-demo" action="" style="display:inline-block" :http-request="importExport" :auto-upload="false" ref="upload" accept=".xls, .xlsx">
							<el-button size="small" type="green">上传</el-button>
						</el-upload>
					</el-col>
				</el-row>
				<el-row>
					<div style="text-align: center;">
						<el-button @click="onBuild" type="green">调试</el-button>
						<el-button @click="onCancle" type="yellow">取消</el-button>
					</div>
				</el-row>
			</div>
		</div>
	</div>
</template>

<script>
	import api from "../common/api.js";
	import Vue from "vue";
	import { Message, MessageBox } from 'element-ui'
	export default {
		name: 'Header',
		data() {
			return {
				name: '',
				objName:'',
				objFile:'',
				boxShow:false,
				total: 10,
				currentPage4: 1,
				tableData: [],
				pageNo: 0,
				pageSize: 10,
			}
		},
		methods: {
			//点击❌，请求全部数据，不用点查询
			cleanData() {
				this.getObjList()
			},
			importExport(file) {
				this.formData = new FormData()
				this.formData.append('file', file.file);
				api.upload(api.getUrl('export'), this.formData).then(res => {
					if(!!res) {
						Message({
							showClose: true,
							type: 'success',
							message: '上传成功'
						})
						this.$refs.upload.clearFiles()
						this.getCommodityManagementList()
					} else {
						Message({
							showClose: true,
							type: 'error',
							message: '上传失败'
						})
					}
				})
			},
			onSave() {
				if(this.objName && this.objFile) {
					let req = {
						id: this.id || null,
						name: this.objName,
						description: this.objFile
					}
					console.log(req)
					api.post(api.getUrl('poolAdd'), req).then(res => {
						if(res.code == '0000') {
							this.boxShow = false
							this.getObjList()
						} else {
							this.$message({
								type: 'info',
								message: '系统异常'
							});
						}

					}).catch(() => {
						console.log("系统异常")
					})
				} else {
					this.$message({
						type: 'info',
						message: '带*为必填'
					});
				}
			},
			onBuild(rows) {
			},
			onAdd() {
				this.boxShow = true
			},
			build(rows) {
				this.buildId = rows.id
				this.buildShow = true
				this.baseBuild = false
				window.location.href= 'http://99.48.68.95:8085/static/aphrodite.html'
			},
			onCancle() {
				this.boxShow = false
			},
			edit(rows) {
				this.boxShow = true
				this.addShow = false
				this.id = rows.id
				let req = {
					id: rows.id
				}
				api.post(api.getUrl('poolDetail'), req).then(res => {
					let content = res.content
					this.poolName = content.name
					this.description = content.description
				}).catch(() => {
					console.log("系统异常")
				})

			},
			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.pageSize = val
				this.getObjList()
			},
			handleCurrentChange(val) {
				this.pageNo = val - 1
				this.getObjList()
			},
			deleteFun(rows) {
				this.$confirm('确认要删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					let req = {
						id: rows.id
					}
					api.post(api.getUrl('remove'), req).then(res => {
						if(res.code == '0000') {
							this.$message({
								type: 'info',
								message: '删除成功！'
							});
							this.getObjList()
						} else {
							this.$message({
								type: 'info',
								message: res.desc
							});
						}
					}).catch(() => {
						console.log("系统异常")
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});

			},
			//table列表
			getObjList() {
				let req = {
					pageNo: 0 || this.pageNo,
					pageSize: this.pageSize,
					name: this.name || null,
				}
				api.post(api.getUrl('getPoolList'), req).then(res => {
					this.tableData = res.content;
					this.total = res.total
				}).catch(() => {
					console.log("系统异常")
				})
			},
			onSearch() {
				this.pageNo = 0
				this.getObjList()
			},
		},
		mounted() {
			this.getObjList()
		},
	}
</script>

<style lang="scss">
	@import "../../static/common.scss";
	.categoryManagement {
		.el-form-item {
			margin-bottom: 10px;
		}
		.el-input__icon {
			line-height: 25px;
		}
	}
</style>