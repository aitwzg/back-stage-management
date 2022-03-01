$(function () {
    // 点击去注册账号的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录账号的链接

    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于判断
            // 如果判断失败ruturn一个提示消息
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }

    })

    $('#form_reg').on('submit', function (e) {
        e.preventDefault()
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() };
        $.post('/api/reguser',data,
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // console.log('注册成功');
                layer.msg('注册成功请登录')
                $('#link_login').click()

            }
        )
    })

    $('#form_login').submit(function(e){
        e.preventDefault()
        $.ajax({
            url:'/api/login',
            method:'POST',
            data:$(this).serialize(),
            success:function(res){
                if(res.status!==0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                // console.log(res.token);
                localStorage.setItem('token',res.token)
                location.href = 'index.html'
            }
        })
    })

})