$(function () {
    var layer = layui.layer
    var form = layui.form
    initCate()
    $('.amend').hide()

    // 初始化用户的基本信息
    var baseUrl = 'http://www.liulongbin.top:3007'
    var id = null;
    $('tbody').on('click', '.btn-amend', function () {
        $('.amend').show()
        $('.list').hide()
        id =$(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败！')
                }
                // 调用 form.val() 快速为表单赋值
                form.val('formAmendInfo', res.data)
                // console.log(res.data.content);
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src',baseUrl+ res.data.cover_img)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
                    // $('#tinymce').html(res.data.content)
            }
        })
    })

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg()
                }
                var htmlStr = template('tpl-cate2', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }
    // 初始化富文本编辑器
    initEditor()
    // console.log(window.frames["#contente_ifr"].document.querySelector('#tinymce')); 
    // console.log($("#contente_ifr"));


    


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为封面按钮绑定一个点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    $('#coverFile').on('change', function (e) {
        var files = e.target.files

        if (files.lenght === 0) {
            return
        }
        var newImgURL = URL.createObjectURL(files[0])
        console.log(newImgURL);
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    var art_state = '已发布'

    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        // 阻止默认行为
        e.preventDefault()
        // 快速创建form表单
        var fd = new FormData($(this)[0])
        // 将文章的发布状态存到fd中
        fd.append('state', art_state)
        // console.log(fd);
        console.log(fd);


        // 将裁剪过后的图片输出为一个文件对象

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                fd.append('id',id)
                publishArticle(fd)

            })


        // 定义一个发布文章的方法
        function publishArticle(fd) {
            $.ajax({
                method: 'post',
                url: '/my/article/edit',
                data: fd,
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('发布文章失败')
                    }
                    layer.msg('发布文章成功')
                    location.href = '/article/art_list.html'
                }
            })
        }
    })


})