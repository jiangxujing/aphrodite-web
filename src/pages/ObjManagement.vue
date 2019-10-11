<template>
	<div class="categoryManagement">
		<div>
			<div>
				<el-form :inline="true" class="demo-form-inline">
					<el-form-item label="名称：">
						<el-input v-model="name" placeholder="请输入名称" clearable @clear="cleanData">
						</el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="onSearch" type="red" icon="el-icon-search" style="padding:8px 20px">查询</el-button>
						<el-button @click="onAdd" type="add" style="padding: 8px 20px;" icon="el-icon-circle-plus-outline">新增</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div>
				<el-table :data="tableData" style="width: 100%;margin:0 auto;margin-top:20px;" border>
					<el-table-column prop="name" label="名称" align="center">
					</el-table-column>
					<el-table-column prop="fileUrl" label="文件名称" align="center">
					</el-table-column>
					<el-table-column prop="operator" label="操作人" align="center">
					</el-table-column>
					<el-table-column prop="createTime" label="创建时间" align="center" :formatter="$utils.dateFormat">
					</el-table-column>
					<el-table-column prop="updateTime" label="修改时间" align="center" :formatter="$utils.dateFormat">
					</el-table-column>
					<el-table-column align="center" label="操作" width="130">
						<template slot-scope="scope">
							<el-button type="warning" size="small" @click="build(scope.row)" icon="el-icon-setting">调试</el-button>
							<el-button type="add" @click="edit(scope.row)" icon="el-icon-edit" style="margin-top:10px;margin-left:0;padding: 9px 15px;">编辑</el-button>
							  <el-button type="danger" size="small" @click="deleteFun(scope.row)" icon="el-icon-delete" style="margin-top:10px;margin-left:0">删除</el-button>
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
						<el-input v-model="objName" maxlength="100" clearable placeholder="名称" style="width:300px" @input="checkLength"></el-input>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="4" class="search-label"><span class="red">*</span><span class="label">Obj文件：</span></el-col>
					<el-col :span="10">
						<el-input type="text" v-model="fileUrl" style="width:300px" clearable></el-input>
						<el-upload v-if="!fileUrl" class="upload-demo" style="text-align:left;display: inline-block;" accept="*" :show-file-list="false" :http-request="importExport" action="string">
							<el-button size="small" type="green">上传</el-button>
						</el-upload>
						<el-button @click="deleteObj" type="warning" style="padding:8px 20px" v-else>删除</el-button>
					</el-col>
					
				</el-row>
				<el-row>
					<div style="text-align: center;">
						<el-button @click="onBuild" type="green">调试</el-button>
						<el-button @click="onSave" type="add">保存</el-button>
						<el-button @click="onCancle" type="warning" style="padding:8px 20px">取消</el-button>
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
				fileUrl:'',
				pageNo: 0,
				pageSize: 10,
			}
		},
		methods: {
			//点击❌，请求全部数据，不用点查询
			cleanData() {
				this.getObjList()
			},
			checkLength(){
				console.log(this.objName.length)
				if(this.objName.length >= 100){
					Message({
							showClose: true,
							type: 'error',
							message: '名称长度已达上限！'
						})
				}
			},
			deleteObj(){
				let req = {
					name:this.fileUrl
				}
				this.$confirm('确认要删除吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					console.log('删除')
						api.post(api.getUrl('deleteFile'), req).then(res => {
							console.log('res')
							if(res.code == '0000') {
								Message({
									showClose: true,
									type: 'success',
									message: '删除成功'
								})
								this.fileUrl = ''
							} else {
								Message({
									showClose: true,
									type: 'error',
									message: '删除失败'
								})
							}
						})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
				
			},
			importExport(file) {
				this.formData = new FormData()
				this.formData.append('file', file.file);
				api.upload(api.getUrl('upload'), this.formData).then(res => {
					if(res.code == '0000') {
						Message({
							showClose: true,
							type: 'success',
							message: '上传成功'
						})
						this.fileUrl = res.content
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
				if(this.objName && this.fileUrl) {
					let req = {
						id: this.id || null,
						name: this.objName,
						fileUrl: this.fileUrl
					}
					api.post(api.getUrl('getObjSave'), req).then(res => {
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
					})
				} else {
					this.$message({
						type: 'info',
						message: '带*为必填'
					});
				}
			},
			onBuild(rows) {
				window.location.href= '/static/aphrodite.html?obj='+this.fileUrl
			},
			onAdd() {
				this.objName = ''
				this.fileUrl = ''
				this.boxShow = true
			},
			build(rows) {
				this.buildId = rows.id
				this.buildShow = true
				this.baseBuild = false
				this.id = rows.id
				let req = {
					id: rows.id
				}
				api.post(api.getUrl('getObjDetail'), req).then(res => {
					if(res.code == '0000'){
						window.location.href= 'static/aphrodite.html?obj='+res.content.fileUrl
					}
				}).catch(() => {
					console.log("系统异常")
				})
				
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
				api.post(api.getUrl('getObjDetail'), req).then(res => {
					let content = res.content
					this.objName = content.name
					this.fileUrl = content.fileUrl
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
					api.post(api.getUrl('getObjDel'), req).then(res => {
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
				api.post(api.getUrl('getObjList'), req).then(res => {
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
		.el-table th{
			background:#24608C;
			/*height:70px;*/
			color:#fff;
		}
		
	}
	.el-loading-spinner i{
			font-size:50px!important;
		}
</style>