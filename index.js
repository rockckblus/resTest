//修改post传值为标准格式
var app = angular.module('city', [], function () {
});


app.controller('body', function ($scope) {
    $scope.item = {};//声明每一题的对象
    var allNum = 6;//总题数  (可根据题目数自己配置)
    var jsonObj = db;
    var numJson = 0;//声明Json数组排序变量
    var errorArr = [];//声明错题的空数组

    $scope.allCode = 0;//声明总得分数
    $scope.mess = '';//声明提示信息模型
    $scope.item = jsonObj[numJson];
    $scope.errItem = [];//错题对象

    /** 遍历mark分数值 加入 db  */
    jionMark();


    /**
     * next点击事件
     * 15-10-27 */
    $scope.nextClick = function () {

        if ($('#nextButton').data('sub')) {
            $('#cuoTi').show();
            $('#content').hide();
            nextFun.getErrItem();//获取错题模型
        } else {
            if ($scope.item.type == 'radio') {
                nextFun.checkRadioInput();//判断单选正确性,以及空
            } else if ($scope.item.type == 'checkbox') {
                nextFun.checkCheckBoxInput();//判断多选正确性,以及空
            }
        }
    }


    /**
     * 清空提示信息
     * 15/10/28 */
    $scope.clearMess = function () {
        $scope.mess = '';
    }


    //点击相关方法对象
    var nextFun = {
        //item模型，转换为下一题模型
        itemNext: function () {

            numJson++;
            if (numJson >= allNum) {
                //判断是否最后一道题
                $('#nextButton').css({
                    'font-size': '14px',
                    'backgroundColor': 'red',
                    'color': '#fff'
                }).data('sub', true).text('提交试卷');
                $scope.item = {};
                $scope.item.title = '答题完毕！请提交试卷';
                return false;
            } else {
                $scope.item = jsonObj[numJson]; // 使angular 按照数组顺序 到下一题
            }

        },

        //判断单选选择为空
        checkRadioInput: function () {
            var nameItem = 'name' + $scope.item.id;
            var nameStr = 'input:radio[name=' + nameItem + ']:checked';
            var val = $(nameStr).val();
            if (!val) {
                $scope.mess = '请选择答案';
                return false;
            } else {
                nextFun.checkRadioOk(val, function () {
                    $scope.mess = '';
                    nextFun.itemNext(); //item模型，转换为下一题模型
                });
            }
        },

        //判断单选正确性
        checkRadioOk: function (v, fun) {
            if (v) {
                var tempObj = $scope.item.select;
                var okVal = '';//正确答案

                for (var i = 0; i < tempObj.length; i++) {
                    if (tempObj[i].ok) {
                        okVal = tempObj[i].k;
                    }
                }
                //比较答案
                if (v != okVal) {//如果错误就把id push到 错误数组
                    errorArr.push($scope.item.id);
                } else {
                    $scope.allCode = $scope.allCode + $scope.item.mark;
                }
                console.log('errorArr', errorArr);
                fun();//执行回调
            } else {
                alert('传值错误');
                return false;
            }
        },

        //判断多选选择为空
        checkCheckBoxInput: function () {
            var nameItem = 'nameCheckBox' + $scope.item.id;
            var nameStr = 'input[name=' + nameItem + ']:checked';
            var s = 0;//判断空标示
            var o = [];//所选择的所有选项数组
            var val = $(nameStr).each(function () {
                var v = $(this).val();
                if (v) {
                    s++;
                    o.push(v);
                }
            });

            if (!s) {
                $scope.mess = '至少选择1项';
                return false;
            } else {//判断正确错误
                this.checkCheckBoxOk(o, function () {
                    $scope.mess = '';
                    nextFun.itemNext(); //item模型，转换为下一题模型
                });
            }
        },

        //判断多选正确性
        checkCheckBoxOk: function (o, fun) {
            var tempObj = $scope.item.select;
            var okValArr = [];//正确答案
            var tempOk = false;//声明临时题目对错判断


            for (var i = 0; i < tempObj.length; i++) {
                if (tempObj[i].ok) {
                    okValArr.push(tempObj[i].k);
                }
            }

            //先判断 正确答案的个数 是否相同
            if (o.length != okValArr.length) {
                errorArr.push($scope.item.id);//个数不相同直接 记录错误id
            } else {
                for (var i = 0; i < okValArr.length; i++) {  //遍历正确答案，是否在传来的 选择数组中
                    if ($.inArray(okValArr[i], o) > -1) {
                        tempOk = true;
                    } else {//否直接记录错误，跳出循环
                        errorArr.push($scope.item.id);
                        break;
                    }
                }
            }

            if (tempOk) {
                $scope.allCode = $scope.allCode + $scope.item.mark;
            }
            console.log('errorArrRadio', errorArr);
            fun();
        },

        /**
         * 遍历错题
         * 15/10/28 */
        getErrItem: function () {
            for (var i = 0; i < errorArr.length; i++) {
                for (var ii = 0; ii < jsonObj.length; ii++) {
                    if (jsonObj[ii].id == errorArr[i]) {
                        $scope.errItem.push(jsonObj[ii]);
                    }
                }
            }
        }


    }


    /** 遍历mark分数值 加入 db  */
    function jionMark() {
        for (var vo in jsonObj) {
            jsonObj[vo].mark = 1;
            for (var vo2 in mark) {
                if (jsonObj[vo].id == mark[vo2].id) {
                    jsonObj[vo].mark = mark[vo2].mark;
                }
            }
        }
    }


})
