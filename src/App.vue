<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body,html{
		margin:0;
		width:100%;
		height:100%;
	}
	ul,li{
		 list-style-type: none;
	}
	#app{
		width:100%;
		height:100%;
	}
	.el-button--green {
    background-color:#FF5353;
    border-color: #FF5353;
    color: #fff;
    padding:8px 20px;
}
	.el-button--add {
    background-color:#336699;
    border-color: #336699;
    color: #fff;
    padding:8px 20px;
}

.el-button--red {
    background-color:#F56C6C;
    border-color: #F56C6C;
    color: #fff;
}
.el-button--red:hover,.el-button--red:focus{
	  background-color:#FF7171;
    border-color: #FF7171;
    color:#fff;
}

	.el-button--yellow {
    background-color:#feb764;
    border-color: #feb764;
    color: #fff;
    padding:8px 20px;
}
.el-button--green:hover,.el-button--green:focus{
	background-color:#FF7171;
    border-color: #FF7171;
    color:#fff;
}
.el-button--add:hover,.el-button--add:focus{
	background-color:#4080BF;
    border-color: #4080BF;
    color:#fff;
}
.el-button--yellow:hover,.el-button--yellow:focus{
	background-color:#FECA89;
    border-color: #FECA89;
    color:#fff;
}
.el-pagination{
	.el-pager{
		.number{
			border:1px solid #ccc;
			color:#666;
			font-weight: normal;
		}
	}
	.el-pagination__editor{
		width:36px!important;
	}
}
input::-webkit-input-placeholder {
				    color: #fff;
				}
				.input:-moz-placeholder {
				    color: #fff;
				}
				.input:-ms-input-placeholder {
				    color: #fff;
				}
	.commonFontstyle{
			color: #03a693;
      font-size:14px;
	}			
	.gray999{
		color:#999
	}
	  .el-pagination {
    text-align: right;
    margin-top: 30px;

    .el-pagination__total {
      float: left;
      color: #666;
    }

    .el-pager {
      .active {
        background-color: #03a693 !important;
      }
    }
  }
  .breadcrumb{
  	margin-bottom:20px;
  	font-size:14px;
			span{
				cursor: pointer;
			}
  }
  .el-input__inner{
  	height:28px;
  }
  .defaultBtn{
  	padding:8px 20px;
  }
  .longwidth1{
  	 width:79%
  }
  .error{
  	color:red;
  	font-size:10px;
  	display: none;
  }
.el-textarea{
	width:200px;
}
</style>
