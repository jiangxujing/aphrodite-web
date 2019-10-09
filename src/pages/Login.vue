<template>
	<div class="loginWrapper">
		<div class="loginInput">
			<div class="title">3D调试系统</div>
			<el-form :model="form" ref="form"  :rules="rules">
				  <el-form-item prop="userName">
				    <el-input placeholder="用户名" v-model="form.userName" clearable></el-input>
				  </el-form-item>
				  <el-form-item prop="password">
				    <el-input placeholder="密码" type="password" v-model="form.password" clearable style="margin-top:20px;" @keyup.enter.native="loginFun('form')"></el-input>
				  </el-form-item>
			</el-form>
			 <el-button type="primary" class="submitBtn" @click="submit('form')">登录</el-button>
		</div>
	</div>
</template>

<script>
	  import api from "../common/api.js";
	  import Vue from "vue";
	 import { Message, MessageBox } from 'element-ui'
export default {
  name: 'Header',
  data () {
    return {
    	form:{
    		userName:'',
    		password:'',
    	},
    	 rules: {
	          userName: [
	             { required: true, message: '请输入必填项', trigger: 'blur' },
	          ],
	          password:[
	          	{ required: true, message: '请输入必填项', trigger: 'blur' },
	          ]
	          
	        }
  }
},
  methods:{
  	loginFun(formName){
  		  this.$refs[formName].validate((valid) => {
          if (valid) {
          	let req = {
  			account:this.form.userName,
  			password:this.form.password
  		}
          	api.post(api.getUrl('login'),req).then(res=>{
          		if(res.code == '0000'){
          		    sessionStorage.setItem('userName',res.content.name)
          			sessionStorage.setItem('token',res.content.token)
          			this.$router.push("/ObjManagement")
          		}else{
          			MessageBox.alert(res.desc, '提示')
          		}
		   }).catch(()=>{
					console.log("系统异常")
				})
          } else {
          	console.log(valid)
            console.log('error submit!!');
            return false;
          }
        });
  	},
  	submit(formName){
  		  this.$refs[formName].validate((valid) => {
          if (valid) {
          	let req = {
  			account:this.form.userName,
  			password:this.form.password
  		}
          	api.post(api.getUrl('login'),req).then(res=>{
          		if(res.code == '0000'){
          			sessionStorage.setItem('userName',res.content.name)
          			sessionStorage.setItem('token',res.content.token)
          			this.$router.push("/ObjManagement")
          		}else{
          			MessageBox.alert(res.desc, '提示')
          		}
		   }).catch(()=>{
					console.log("系统异常")
				})
          } else {
          	console.log(valid)
            console.log('error submit!!');
            return false;
          }
        });
  		
  	}
  },
   mounted() {
  },
  }

</script>

<style lang="scss">
.loginWrapper{
	width:100%;
	height:100%;
	background: url(../image/login/bg.jpg) no-repeat center top;
	background-size:100%;
	.el-input{
		width:100%
	}
	.loginInput{
		    position: absolute;
		    right: 5%;
		    top: 40%;
		    width: 320px;
		    margin: -150px 0 0 -190px;
		    padding: 40px;
		    border-radius: 22px;
		    background: #fff;
  border: 1px #d7edff solid; 
  border-radius: 5px; 
  margin: 0px 0px 7px 0px;
  box-shadow:5px 5px 10px gray;
  background: -webkit-linear-gradient(left,#ffffff, #a7d6ff); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(right,#ffffff, #a7d6ff); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(right,#ffffff, #a7d6ff); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right,#ffffff, #a7d6ff); /* 标准的语法（必须放在最后） */
		    input{
		    	height:45px;
		    }
		   .title{
		   	    text-align: center;
			    font-size: 30px;
			    color: #95989a;
			    margin-bottom: 20px;
		   } 
		   .submitBtn{
		   		width: 80%;
			    display: block;
			    margin: 20px auto 0;
		   }
	}
}
</style>
