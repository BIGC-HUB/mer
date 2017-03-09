var __initEdit = function() {
    var html =
    '<ul id="edit-ul"></ul><div id="edit-cont">' +
        '<div class="text"></div><hr>' +
        '<div class="val"><span>名　字</span><input id="edit-cont-name"></div>' +
        '<div class="val"><span>网　址</span><textarea id="edit-cont-url" rows="1"></textarea></div>' +
        '<div class="val half"><span>颜　色</span><input id="edit-cont-color"></div>' +
        '<div class="val half"><span>图　标</span><input id="edit-cont-icon"></div>' +
        '<div class="val"><span>移动端</span><textarea id="edit-cont-wap" rows="1"></textarea></div><hr>' +
        '<button id="edit-cont-yes" class="btn btn-white"><i class="fa-lg iconfont icon-yes"></i>确定</button>' +
        '<button id="edit-cont-no"  class="btn btn-white"><i class="fa-lg iconfont icon-no"></i>返回</button>' +
        '<button id="edit-cont-del" class="btn btn-white"><i class="fa-lg iconfont icon-del"></i>删除</button>'
    $('#edit').html(html)
}()

// Edit
Mer.edit = {
    show: function(html) {
        Mer.edit.at = event.target
        var e = event.target
        if (html) {
            $('#edit-ul').html(html)
        } else {
            return false
        }
        var x = event.clientX
        if (window.document.body.offsetWidth - x < 160) {
            x = window.document.body.offsetWidth - 165
        }
        $(e).addClass('edit-hover')
        $('#edit-ul').css({
            display: "block",
            top: event.clientY + "px",
            left: x + "px"
        })
        setTimeout(function(){
            $('body').one('mousedown', function() {
                var edit = event.target.classList.contains('edit')
                var key  = event.target.dataset.btn
                if (edit) {
                    Mer.edit[key](e)
                } else {
                    $(e).removeClass('edit-hover')
                    $('#edit-ul').hide()
                }
            })
        }, 100)
    },
    hide: function(e) {
        $(e).removeClass('edit-hover')
        $('#edit-ul').hide()
    },
    at: {}
}
Mer.rest = {
    time: 0,
    short: true,
    tag: function(e, arr) {
        for (var i of arr) {
            if (i === e.localName) {
                return true
            }
        }
        return false
    },
    cls: function(e, arr) {
        for (var i of arr) {
            if (e.classList.contains(i)) {
                return true
            }
        }
        return false
    },
    html: function(e) {
        var html = ''
        if (Mer.rest.tag(e, ['book','engine'])) {
            html =
                '<li data-btn="new"   class="edit"><span>添加</span></li>' +
                '<li data-btn="amend" class="edit"><span>编辑</span></li>' +
                '<li data-btn="move"  class="edit"><span>移动</span></li>'
        } else if (Mer.rest.tag(e, ['tag'])) {
            html =
                '<li data-btn="new"   class="edit"><span>添加</span></li>' +
                '<li data-btn="amend"   class="edit"><span>重命名</span></li>'
        } else if (Mer.rest.cls(e, ['show', 'kind'])) {
            html =
                '<li data-btn="new"   class="edit"><span>添加</span></li>'
        } else if (Mer.rest.tag(e, ['textarea', 'input'])) {
            html =
                '<li data-btn="copy"  class="edit"><span>复制</span></li>' +
                '<li data-btn="paste" class="edit"><span>粘贴</span></li>'
        }
        return html
    }
}
$('body').on('touchstart', function() {
    Mer.rest.time = parseInt(event.timeStamp)
})
$('body').on('touchend', function() {
    var time = parseInt(event.timeStamp) - Mer.rest.time
    if (time < 300) {
        Mer.rest.short = true
    } else {
        Mer.rest.short = false
    }
})

$('#edit-cont textarea').on('input', function() {
    var e = event.target
    e.value = e.value.replace(/\n| /g,'')
    if (e.value) {
        e.rows = parseInt(e.scrollHeight / e.dataset.dif)
    } else {
        e.rows = 1
    }
})
$('#edit-cont textarea').on('focus', function() {
    var e = event.target
    var dif = e.scrollHeight
    e.value += '\n'
    dif = e.scrollHeight - dif
    var arr = e.value.split('')
    arr.splice(-1, 1)
    e.value = arr.join('')
    e.rows = parseInt(e.scrollHeight / dif)
    e.dataset.dif = dif
})
$('#edit-cont textarea').on('blur', function() {
    event.target.rows = 1
})

$('#edit-cont-color').on('blur', function() {
    event.target.style.color = event.target.value
})
$('#edit-cont-no').on('click', function() {
    $('#edit-cont').hide()
    $('#' + $('#edit-cont-no')[0].dataset.tag).show()
})

// PC右键菜单
$('body').on('click', function() {
    document.oncontextmenu = function() {
        var e = event.target
        Mer.edit.show(Mer.rest.html(e))
        return false
    }
    var e = event.target
    if (!Mer.rest.short) {
        if (!Mer.rest.tag(e, ['textarea', 'input'])) {
            Mer.edit.show(Mer.rest.html(e))
        }
    }
})

// 增删改查
Mer.edit.new = function(e) {
    Mer.edit.hide(e)
    $('#engine,#book').hide()
    $('#edit-cont .val').show()
     // 空白处
    if (e.localName === 'div') {
        var e = e.children[0]
    }
    var tag = e.dataset.kind || e.localName
    var key = e.dataset.key
    var name = e.dataset.cls
    var kind = tag + 's'
    if (key) { //.show
        var i = User[kind][name][key]
        if (i.icon) { // engine
            $('#edit-cont .text').text('添加丨引擎')
            $('#edit-cont-wap').val('')
            $('#edit-cont-icon').val('')
            $('#edit-cont-color').parent().addClass('half')
        } else { // book
            $('#edit-cont .text').text('添加丨书签')
            $('#edit-cont-icon,#edit-cont-wap').parent().hide()
            $('#edit-cont-color').parent().removeClass('half')
        }
        $('#edit-cont-color').val('')
        $('#edit-cont-url').val('')
        $('#edit-cont-name').val('')
    } else { //.kind
        $('#edit-cont .text').text('添加丨分类')
        $('#edit-cont-icon,#edit-cont-wap,#edit-cont-url,#edit-cont-color').parent().hide()
        $('#edit-cont-name').val('')
    }
    $('#edit-cont-no')[0].dataset.tag = tag
    $('#edit-cont-yes')[0].dataset.btn = 'new'
    $('#edit-cont').show()
}
Mer.edit.amend =  function(e) {
    Mer.edit.hide(e)
    $('#engine,#book').hide()
    var tag = e.dataset.kind || e.localName
    var key = e.dataset.key
    var name = e.dataset.cls
    var kind = tag + 's'
    $('#edit-cont .val').show()
    if (key) { //.show
        var i = User[kind][name][key]
        if (i.icon !== undefined) { // engine
            $('#edit-cont .text').text('编辑丨引擎')
            $('#edit-cont-wap').val(i.wap)
            $('#edit-cont-icon').val(i.icon)
            $('#edit-cont-color').parent().addClass('half')
        } else { // book
            $('#edit-cont .text').text('编辑丨书签')
            $('#edit-cont-icon, #edit-cont-wap').parent().hide()
            $('#edit-cont-color').parent().removeClass('half')
        }
        $('#edit-cont-color').val(i.color)
        $('#edit-cont-color').css('color', i.color)
        $('#edit-cont-url').val(i.url)
        $('#edit-cont-name').val(key)
    } else { //.kind
        $('#edit-cont .text').text('重命名')
        $('#edit-cont-icon,#edit-cont-wap,#edit-cont-url,#edit-cont-color').parent().hide()
        $('#edit-cont-name').val(name)
    }
    $('#edit-cont-no')[0].dataset.tag = tag
    $('#edit-cont-yes')[0].dataset.btn = 'amend'
    $('#edit-cont').show()
}
Mer.edit.del = function(e) {
    Mer.edit.hide(e)
    var tag = e.dataset.kind || e.localName
    var cls = e.dataset.cls
    var key = e.dataset.key
    var kind = tag + 's'
    if (key) {
        delete User[kind][cls][key]
        e.remove()
    } else {
        if (Object.keys(User[kind][cls]).length) {
            $('#edit-cont .text').html('<div class="text">提示：类不为空</div>')
        } else {
            delete User[kind][cls]
            e.remove()
        }
    }
}
Mer.edit.move = function(e) {
    Mer.edit.hide(e)
}

// 增删改查 - 提交
Mer.send = {
    repeat: function(arr, name) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === name) {
                return false
            }
        }
        return true
    }
}
Mer.send.amend = function(e) {
    var tag = e.dataset.kind || e.localName
    var key = e.dataset.key
    var name = e.dataset.cls
    var kind = tag + 's'
    var newName = $('#edit-cont-name').val()
    var newUrl  = $('#edit-cont-url').val()
    // 表单验证
    if (!newName) {
        $('#edit-cont .text').text('名字不能为空')
        $('#edit-cont-name').focus()
    } else {
        // 数据存储
        if (key) { //.show
            if (!newUrl) {
                $('#edit-cont .text').text('网址不能为空')
                $('#edit-cont-url').focus()
            } else {
                var i = {}
                if (User[kind][name][key].icon !== undefined) { // engine
                    i.icon = $('#edit-cont-icon').val()
                    i.color = $('#edit-cont-color').css('color')
                    i.wap = $('#edit-cont-wap').val()
                    i.url = $('#edit-cont-url').val()
                } else { // book
                    i.color = $('#edit-cont-color').css('color')
                    i.url = $('#edit-cont-url').val()
                }
                var bool = Mer.send.repeat(Object.keys(User[kind][name]), newName)
                if (bool) {
                    User[kind][name][newName] = JSON.parse(JSON.stringify( User[kind][name][key] ))
                    delete User[kind][name][key]
                    // 没有重复才可以删除
                    $(e.parentElement).html(Mer.showHtml(tag, name))
                    $('#edit-cont-no').click()
                } else if (key == newName) {
                    User[kind][name][newName] = i
                    // 直接修改
                    $(e.parentElement).html(Mer.showHtml(tag, name))
                    $('#edit-cont-no').click()
                } else {
                    $('#edit-cont .text').text('名字不能重复')
                    $('#edit-cont-name').focus()
                }

            }
        } else { //.kind
            var bool = Mer.send.repeat(Object.keys(User[kind]), newName)
            if (bool) {
                User[kind][newName] = JSON.parse(JSON.stringify( User[kind][name] ))
                delete User[kind][name]
                e.innerText = newName
                e.dataset.cls = newName
                $('#edit-cont-no').click()
            } else {
                $('#edit-cont .text').text('名字不能重复')
                $('#edit-cont-name').focus()
            }

        }
    }
}
Mer.send.new = function(e) {
    if (e.localName === 'div') {
        e = e.children[0]
    }
    var tag = e.dataset.kind || e.localName
    var key = e.dataset.key
    var name = e.dataset.cls
    var kind = tag + 's'
    var newName = $('#edit-cont-name').val()
    var newUrl  = $('#edit-cont-url').val()
    // 表单验证
    if (!newName) {
        $('#edit-cont .text').text('名字不能为空')
        $('#edit-cont-name').focus()
    } else {
        // 数据存储
        if (key) { //.show
            if (!newUrl) {
                $('#edit-cont .text').text('网址不能为空')
                $('#edit-cont-url').focus()
            } else {
                var i = {}
                var showhtml = ''
                if (User[kind][name][key].icon) { // engine
                    i.icon = $('#edit-cont-icon').val()
                    i.color = $('#edit-cont-color').css('color')
                    i.wap = $('#edit-cont-wap').val()
                    i.url = $('#edit-cont-url').val()
                    if (i.icon) {
                        showhtml = `<${tag} data-cls="${name}" data-key="${newName}"><i style="color:${i.color}" class="fa-logo iconfont icon-${i.icon}"></i></${tag}>`
                    } else {
                        showhtml = `<${tag} data-cls="${name}" data-key="${newName}"><span style="color:${i.color}">${newName}</span></${tag}>`
                    }
                } else { // book
                    i.color = $('#edit-cont-color').css('color')
                    i.url = $('#edit-cont-url').val()
                }
                var bool = Mer.send.repeat(Object.keys(User[kind][name]), newName)
                if (bool) {
                    $(e.parentElement).append(showhtml)
                    User[kind][name][newName] = i
                    $('#edit-cont-no').click()
                } else {
                    $('#edit-cont .text').text('名字不能重复')
                    $('#edit-cont-name').focus()
                }

            }
        } else { //.kind
            var bool = Mer.send.repeat(Object.keys(User[kind]), newName)
            if (bool) {
                // User[kind][newName] = JSON.parse(JSON.stringify( User[kind][name] ))
                // delete User[kind][name]
                // e.innerText = newName
                // e.dataset.cls = newName
                // $('#edit-cont-no').click()
            } else {
                $('#edit-cont .text').text('名字不能重复')
                $('#edit-cont-name').focus()
            }

        }
    }
}
$('#edit-cont-yes').on('click', function() {
    Mer.send[event.target.dataset.btn](Mer.edit.at)
})
