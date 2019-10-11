<template>
	<div class="header">
		<el-header style="height:70px;">
			<div class="logo_img">
				<img src="../image/logo.png" />
				<span class="title">3D调试系统</span>
			</div>
			<div class="login_in">
				<div class="dropout" @click="logout">
					<el-button icon="el-icon-unlock" type="red">退出系统</el-button>
				</div>
				<div>欢迎&nbsp;{{userName}},&nbsp;使用3D调试系统!</div>
			</div>
		</el-header>
		<el-container>
			<el-aside width="200px">
				<el-menu uniqueOpened :default-active="indexItem" background-color="#24608C" text-color="#ccc" active-text-color="#fff">
					<el-menu-item :index="''+index" v-for="(i,index) in lists" :key='index' @click="goPage(i.path,i.id)">
						<i class="el-icon-s-management"></i>
						<span slot="title">{{i.title}}</span>
					</el-menu-item>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
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
				realList: [],
				breadsubtitle: '',
				calendatShow: true,
				lists: [{
					title: 'Obj管理',
					path: '/ObjManagement',
					id: '0'
				}],
				userName: '',
				indexItem: ''
			}
		},
		methods: {
			goPage(params, id) {
				this.$router.push(params)
			},
			logout() {
				this.$confirm('确认退出系统吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: ''
				}).then(() => {
					let req = {
						token: sessionStorage.getItem('token')
					}
					api.post(api.getUrl('logout'), req).then(res => {
						sessionStorage.removeItem('token')
						sessionStorage.removeItem('userName')
						this.$router.push("/Login")
					}).catch(() => {
						console.log("系统异常")
					})

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消退出'
					});
				});
			}
		},
		mounted() {
			let path = this.$route.path
			for(var i in this.lists) {
				if(path == this.lists[i].path) {
					console.log("执行没有")
					this.indexItem = this.lists[i].id
				}
			}
			this.userName = sessionStorage.getItem('userName')
		},
	}
</script>

<style lang="scss">
	.header {
		height: 100%;
		width: 100%;
		.el-header {
			background-color: #24608C;
			color: #333;
			text-align: center;
			line-height: 70px;
			.logo_img {
				float: left;
				overflow: hidden;
				img {
					width: 50px;
					height: 50px;
					float: left;
					margin-top: 10px;
				}
				.title {
					color: #fff;
					float: left;
					margin-left: 10px;
					font-size: 20px;
				}
			}
			.login_in {
				float: right;
				padding-right: 20px;
				font-size: 14px;
				div {
					float: right;
					padding-right: 20px;
					color: #FFF;
					img {
						width: 12px;
					}
				}
				.dropout {
					cursor: pointer;
				}
				.dropout:hover {
					color: #D80404;
				}
			}
		}
		.el-container {
			width: 100%;
			height: calc(100% - 70px);
			position: relative;
			.el-aside {
				color: #333;
				text-align: center;
				line-height: 200px;
				.el-menu-item.is-active {
					background-color: #F56C6C!important;
				}
				.is-active:hover {
					background-color: #FF7171!important;
				}
				.el-menu {
					border-right: none;
					height: 100%;
					.el-menu-item {
						text-align: left!important;
					}
					.el-icon-menu {
						padding-left: 20px
					}
					ul li {
						position: relative;
						span {
							position: absolute;
							top: -3px;
							left: 60px;
						}
					}
					.el-submenu__title:hover {
						background: #03a693!important
					}
					.el-submenu__title {
						color: #fff!important;
					}
					.is-opened {
						.el-submenu__title {
							background: #03a693!important;
							color: #fff!important;
						}
						.el-menu-item {
							background: #303033!important;
							&:hover {
								background: #03a693!important
							}
						}
						.el-menu-item-group__title {
							padding: 0!important;
						}
					}
				}
			}
			.el-main {
				background-color: #fff;
				width: 100%;
				height: 100%;
				padding: 30px!important;
			}
		}
	}
</style>