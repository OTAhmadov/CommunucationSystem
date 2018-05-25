/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

$(function () {
    var chosenLang;

    if (document.cookie.indexOf('lang') == -1) {
        chosenLang = Communication.lang;
    }

    else {
        chosenLang = Communication.getCookie('lang');
    }



    $('.language-buttons a').each(function () {
        if ($(this).attr('id') == chosenLang) {
            $(this).parent('li').prependTo($('.language-buttons ul'));

        }
    });

    $('.main-content').on('click', '.language-buttons a', function (e) {
        try {
            e.preventDefault();
            var lang = $(this).attr('id');

            if (lang != 'en' && lang != 'ru') {
                lang = 'az';
            }

            $('.language-buttons a').each(function () {
                $(this).removeAttr('data-chosen');
            });

            document.cookie = "lang=" + lang;
            window.location.reload();
        }
        catch (err) {
            console.error(err);
        }

    });

    if (Communication.token == '0') {
        Communication.initToken('tk');
    }


    Communication.loadLanguagePack('az');
    Communication.loadLanguagePack('en');
    Communication.loadLanguagePack('ru');

    setTimeout(function () {
        Communication.i18n();
        $.fn.datepicker.defaults.language = Communication.lang;
        $.extend(jconfirm.pluginDefaults, {
            confirmButton: Communication.dictionary[Communication.lang]['ok'],
            cancelButton: Communication.dictionary[Communication.lang]['close'],
            title: Communication.dictionary[Communication.lang]['warning']
        });
    }, 1000)



    $('#logoutForm').attr("action", Communication.urls.ROS + "logout");
    $('#logoutForm input[name="token"]').val(Communication.token);

    Communication.Proxy.getProfile();

    Communication.Proxy.loadApplications();

    Communication.Proxy.loadModules(function (modules) {
        $('ul.module .mod-con').prepend(Communication.Service.parseModules(modules));
        $('.module-list').html(Communication.Service.parseModules(modules));
        var currModule = Communication.initCurrentModule('currModule');
        if (localStorage.button != undefined) {
            Communication.Service[localStorage.button]();
            localStorage.removeItem('button');

        }
        else {
            if (currModule != "") {
                Communication.currModule = currModule;
                var module = $('ul.module-list').find('.module-block[data-id="' + Communication.currModule + '"] a');

                if (module.length) {
                    module.click();
                } else {
                    $('ul.module-list').find('.module-block a').eq(0).click();
                }
            }
            else {
                $('ul.module-list').find('.module-block a').eq(0).click();
            }
        }


    });



    $('ul.module-list').on('click', '.module-block a', function (e) {
        NProgress.done();
        NProgress.remove();
        var obj = $(this).parents('li');
        var title = obj.attr('title');
        var id = obj.attr('data-id');
        // $('.module-list').find('.sub-module-con').fadeOut(1);
        $('ul.module-list').find('li').removeClass('active');
        // $(this).parents('li').find('.sub-module-con').fadeIn();
        // $('.module-list').find('.sub-module-con').remove();
        $(this).parents('li').addClass('active');
        try {

            if (obj.attr('data-check') !== '1') {
                NProgress.start();
                Communication.currModule = obj.attr('data-id');
                document.cookie = "currModule=" + Communication.currModule;


                $('.main-content-upd').load('partials/module_' + Communication.currModule + '.html?' + Math.random(), function () {
                    $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');
                    history.pushState({page: id}, null, '#' + title);
                    $('ul.module-list').find('li').removeAttr('data-check');
                    obj.attr('data-check', 1);

                });
            } else {
                return false
            }



            var moduleName = $(this).find('span').html();
            var html = '<li>' +
                    '<span style="color:white;">' + moduleName + '</span>' +
                    '</li>';
            $('ul.breadcrumb').html(html);
            // $('ul .sub_modules').remove();
            Communication.tempData.form = '';
            $('#main-div').removeAttr('data-citizenship');

        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '#orgBack', function () {
        $('ul.module').find('.module-item[data-id="' + Communication.currModule + '"]').click();
    });
    $('body').on('click', '.panel-close', function () {
        $('body').find('.col-sm-4.info').fadeOut(1).css('right', '-100%');
        $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
    });

    $(document).on('click', '.dropdown-menu a.erase', function (e) {
        try {
            var obj = $(this);
            e.preventDefault();
            var parent = obj.parent().closest('.panel-body');
            $.confirm({
                title: Communication.dictionary[Communication.lang]['warning'],
                content: Communication.dictionary[Communication.lang]['delete_info'],
                confirm: function () {
                    obj.parents('.for-align').remove();
                    if (parent.children('.for-align').length == 0) {
                        parent.append('<div class="blank-panel"><h3>' + Communication.dictionary[Communication.lang]['no_information'] + '</h3></div>');
                    }
                },
                theme: 'black'
            });

        }
        catch (err) {
            console.error(err);
        }
    });

    $('body').on('click', '.btn-load-more', function (e) {
        try {
            var typeTable = $(this).attr('data-table');
            var $btn = $(this);
            var type = $btn.attr('data-page');
            var page = parseInt(type ? type : '2');
            var studKeyword = $('#student_search').val();
            var groupKeyword = $('#group_search').val();
            var studQueryparams = $('.main-content-upd .student-search-form').serialize() + '&subModuleId=' + Communication.subModuleId;
            var teachQueryparams = $('.main-content-upd .teacher-search-form').serialize() + '&subModuleId=' + Communication.subModuleId;
            var groupParams = $('.main-content-upd .group-search-form').serialize() + '&subModuleId=' + Communication.subModuleId;
            var count = $('#main-div span[data-student-count]').text();

            $btn.prop('disabled', true);
            if (typeTable == 'students') {
                if (Communication.tempData.form != "") {
                    var advancedSearchForm = Communication.tempData.form;
                    Communication.Proxy.loadStudents(page, advancedSearchForm ? advancedSearchForm : studQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);

                        if (!data.studentList || !data.studentList.length) {
                            $('#main-div span[data-student-count]').text(count);
                            $btn.remove();
                        }
                    });
                }
                else {
                    Communication.Proxy.searchStudent(page, studQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);
                        var ref = typeof data.studentList !== 'undefined' ? data.studentList : data;
                        if (!ref || !ref.length) {
                            $('#main-div span[data-student-count]').text(count);
                            $btn.remove();
                        }
                    });

                }


            }
            else if (typeTable == 'foreignStudents') {
                if (Communication.tempData.form != "") {
                    var advancedSearchForm = Communication.tempData.form;
                    Communication.Proxy.loadForeignStudents(page, advancedSearchForm ? advancedSearchForm : studQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);

                        if (!data.studentList || !data.studentList.length) {
                            $('#main-div span[data-student-count]').text(count);
                            $btn.remove();
                        }
                    });
                }
                else {
                    Communication.Proxy.searchforeignStudents(page, studQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);
                        var ref = typeof data.studentList !== 'undefined' ? data.studentList : data;
                        if (!ref || !ref.length) {
                            $('#main-div span[data-student-count]').text(count);
                            $btn.remove();
                        }
                    });

                }


            }
            else if (typeTable == 'teachers') {
                if (Communication.tempData.form != "") {
                    var advancedSearchForm = Communication.tempData.form;
                    Communication.Proxy.loadTeachers(page, advancedSearchForm ? advancedSearchForm : teachQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);
                        if (!data.teacherList || !data.teacherList.length) {
                            $('#main-div span[data-teacher-count]').text(count);
                            $btn.remove();
                        }
                    });
                }
                else {
                    Communication.Proxy.searchTeacher(page, teachQueryparams, function (data) {
                        $btn.attr('data-page', parseInt(page) + 1);
                        $btn.prop('disabled', false);

                        var ref = typeof data.teacherList !== 'undefined' ? data.teacherList : data;
                        if (!ref || !ref.length) {
                            $('#main-div span[data-teacher-count]').text(count);
                            $btn.remove();
                        }
                    });

                }

            }
            else if (typeTable == 'conversation') {
                Communication.Proxy.getAllConversationList(page, groupParams + '&keyword=' + groupKeyword, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);

                    if (!data.list || (data.list.length == 0)) {
                        $btn.remove();
                    }
                });
            }
            else if (typeTable == 'share') {
                var params = $('.main-content-upd .share-search-form').serialize();
                Communication.Proxy.loadShares(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || !data.length) {
                        $btn.remove();
                    }
                });
            }
            else if (typeTable == 'order_module') {
                var params = $('.main-content-upd .order-search-form').serialize();
                Communication.Proxy.getOrderList(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || !data.length) {
                        $btn.remove();
                    }
                });
            }
            else if (typeTable == 'diplom_module') {
                var params = $('.main-content-upd .diplom-search-form').serialize();
                Communication.Proxy.getDiplomList(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || !data.length) {
                        $btn.remove();
                    }
                });
            }
            else if (typeTable == 'technical_module') {
                var params = $('.main-content-upd .technical-search-form').serialize();
                Communication.Proxy.getTechnicalBaseList(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || !data.length) {
                        $btn.remove();
                    }
                });
            }
            else if (typeTable == 'foreignRelations') {
                var params = $('.main-content-upd .foreign-relation-form').serialize();
                Communication.Proxy.getForeignRelationList(page, params, function (data) {
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!data || !data.length) {
                        $btn.remove();
                    }
                });
            }
            else if (typeTable == 'students-without-order') {
                var form_without = {
                    orderTypeId: $('body').find('#student_list_without').attr('type-id'),
                    orderTypeParentId:$('body').find('#student_list_without').attr('type-parent-id'),
                    orgId:$('body').find('#student_list_without').attr('org-id'),
                    orderId:$('body').find('#student_list_without').attr('order-id'),
                    specId: $('body').find('#org_spec_level_filter-2').val(),
                    specTypeId: $('body').find('#org_spec_level_filter').val()
                };
                Communication.Proxy.getStudentsWithoutOrder(form_without,function(students) {
                    Communication.Service.parseStudentsWithoutOrder(students);
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!students.studentList.length == 0) {
                        $btn.remove();
                    }
                }, page);

            }
            else if (typeTable == 'students-without-order') {
                var form_without = {
                    orderTypeId: $('body').find('#student_list_without').attr('type-id'),
                    orderTypeParentId:$('body').find('#student_list_without').attr('type-parent-id'),
                    orgId:$('body').find('#student_list_without').attr('org-id'),
                    orderId:$('body').find('#student_list_without').attr('order-id'),
                    specId: $('body').find('#org_spec_level_filter-2').val(),
                    specTypeId: $('body').find('#org_spec_level_filter').val()
                };
                Communication.Proxy.getStudentsWithoutOrder(form_without,function(students) {
                    Communication.Service.parseStudentsWithoutOrder(students);
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!students.studentList.length == 0) {
                        $btn.remove();
                    }
                }, page);

            }
            else if (typeTable == 'students-with-order') {
                var form_with = {
                    orderTypeId: $('body').find('#student_list-with').attr('type-id'),
                    orderTypeParentId:$('body').find('#student_list-with').attr('type-parent-id'),
                    orgId:$('body').find('#student_list-with').attr('org-id'),
                    orderId:$('body').find('#student_list-with').attr('order-id'),
                    specId: $('body').find('#org_spec_level_filter-2-with').val(),
                    specTypeId: $('body').find('#org_spec_level_filter-with').val()
                };
                Communication.Proxy.getStudentsWithOrder(form_with,function(students) {
                    Communication.Service.parseStudentsWithOrder(students);
                    $btn.attr('data-page', parseInt(page) + 1);
                    $btn.prop('disabled', false);
                    if (!students.studentList.length == 0) {
                        $btn.remove();
                    }
                }, page);

            }
        }
        catch (err) {
            console.error(err);
        }
    });

    $('#main-div').on('click', '.change-password-submit', function () {
        var isValid = true;

        $(this).parents('.modal-content').find('input.required').each(function () {
            if (!$(this).val()) {
                $(this).addClass('error-border');
                isValid = false;
            }
            else {
                $(this).removeClass('error-border');
            }
        });


        if (!isValid)
            return false;

        var lpass = $('#main-div .last-password').val();
        var npass = $('#main-div .new-password').val();
        var cpass = $('#main-div .confirmed-password').val();
        if (npass !== cpass) {

            $.notify(Communication.dictionary[Communication.lang]['wrong_repeated_password'], {
                type: 'danger'
            });

            return false;

        }

        var password = {};
        password.lastPassword = lpass;
        password.password = npass;
        password.passwordConfirmation = cpass;

        Communication.Proxy.changePassword(password, function (data) {
            if (data) {
                if (data.code == Communication.statusCodes.OK) {
                    $('#main-div .last-password').removeClass('error-border');
                    $('#main-div .settings-password-modal').modal("hide");
                    $.notify(Communication.dictionary[Communication.lang]['success'], {
                        type: 'success'
                    });
                    $('#main-div #logoutForm').find('button[type="submit"]').click();
                }
                else if (data.code == Communication.statusCodes.INVALID_PARAMS) {
                    $.notify(Communication.dictionary[Communication.lang]['wrong_password'], {
                        type: 'danger'
                    });
                    $('#main-div .last-password').addClass('error-border');
                }

            }
        });

    });
    $('#main-div').on('click', '.a-export', function () {
        try {
            var type = $(this).attr('alt');

            var searchform = '';
            var advancedSearchform = '';
            var filterNameSearchForm = '';
            var module = $('#main-div #exportModal').attr('data-module');
            advancedSearchform = Communication.tempData.form;
            if (module === 'students') {
                if (advancedSearchform.length <= 0) {
                    searchform = $('#main-div .student-search-form').serialize();
                }

            }
            else if (module === 'teachers') {
                if (advancedSearchform.length <= 0) {
                    searchform = $('#main-div .teacher-search-form').serialize();
                }

            }

            window.open(Communication.urls.REPORT + 'reports/' + module + '/' + type + '?token=' + Communication.token + (searchform ? '&' + searchform : '') + (advancedSearchform ? '&' + advancedSearchform : ''), '_blank');
            $('#exportModal').modal('hide');
        }
        catch (err) {
            console.error(err);
        }
    });
    $('#main-div').on('click', '[close]', function () {
        try {
            $(this).parents('.modal-content').addClass('hidden');
        }
        catch (err) {
            console.error(err);
        }
    });
    $('#main-div').on('click', 'a.button-icon', function (e) {
        try {
            var id = $(this).attr('data-id');
            if (id == Communication.appId) {
                e.preventDefault();
            }
        }
        catch (err) {
            console.error(err);
        }
    });
    $('#main-div').on('click', '.show-html', function () {
        var id = $(this).attr('data-id');
        window.open(Communication.urls.REPORT + 'reports/orgInfo/' + id + '/html?token=' + Communication.token, '_blank');

    });
    setTimeout(function () {
        window.onpopstate = function (e) {

            if (e.state != null) {
                if ($('.module-item')) {
                    $('.main-content-upd').load('partials/module_' + e.state.page + '.html?' + Math.random(), function () {
                        $('#main-div #buttons_div').attr('title', 'Ümumi əməliyyatlar');

                    });
                }
            }

        }, 0
    });
    $('#main-div').on('click', '#btn_cancel', function () {
        try {
            $('#main-div').load('partials/module_' + Communication.currModule + '.html');
        }
        catch (err) {
            console.error(err);
        }
    });
    $('body').find('.table-scroll').slimScroll();
    
    $('body').on('click', '#operation_1000096', function (e) {
        $('body').find('.add-new .search-scroll').load('partials/shares.html', function () {
            $('#confirmShare').attr('action-status', 'new');
            $('body').find('.add-new').css('right', '0');
        });
    });
    
    $('body').on('click', '#share-list tbody tr', function (e) {
        try {
            var id = $(this).attr('data-id');
            //parse Share Details
            Communication.Proxy.getShareDetails(id, function (data) {
                $('.dl-horizontal').html('');
                $('.col-sm-4.info').attr('data-id', id);
                $('.dl-horizontal').append('<label><b> Elan tipi </b>: ' + data.type.value[Communication.lang] + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Elan dərəcəsi </b>: ' + data.priority.value[Communication.lang] + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Məzmun </b>: ' + data.content + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Başlama tarixi </b>: ' + data.startDate + ' ' + data.startTime + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Bitmə tarixi </b>: ' + data.endDate + ' ' + data.endTime + '</label> <br/>');

                Communication.Proxy.loadVisibleToList(id, function (data) {
                    var visibleTo = '';
                    if (data !== null) {
                        $.each(data, function (i, d) {
                            visibleTo += d.value[Communication.lang];
                            visibleTo += ((i + 1) < data.length) ? ', ' : '';
                        });
                        $('.dl-horizontal').append('<label><b> Kimlər </b>: ' + visibleTo + '</label> <br/>');
                    }
                    Communication.Proxy.loadShareOrgList(id, function (data) {
                        var orgList = '';
                        if (data !== null) {
                            $.each(data, function (i, d) {
                                orgList += d.value[Communication.lang];
                                orgList += ((i + 1) < data.length) ? ', ' : '';
                            });
                            $('.dl-horizontal').append('<label><b> Təşkilatı struktur </b>: ' + orgList + '</label> <br/>');
                        }
                    });
                });
            });
            $('.main-content-upd #buttons_div').attr('data-id', id);
            $('body').find('.type_2_btns').html(Communication.Service.parseOperations(Communication.operationList, '2'))

            $('body').find('.col-sm-12.data').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.col-sm-4.info').fadeIn(1).css('right', '0');
        }
        catch (err) {
            console.error(err);
        }
    });
    
    $('body').on('click', '#operation_1000097', function () {
        try {
            var id = $(this).parents('.info').attr('data-id');
            $('body').find('.add-new .search-scroll').load('partials/shares.html', function () {
                Communication.Proxy.getShareDetails(id, function (data) {
                    $('#main-div .share-form input[name="id"]').val(id);
                    $('#confirmShare').attr('action-status', 'edit');
                    $('#confirmShare').attr('data-id', id);

                    $('#share-type-list').find('option[value="' + data.type.id + '"]').attr('selected', 'selected');
                    $('#share-content').val(data.content);
                    $('#share-priority-list').find('option[value="' + data.priority.id + '"]').attr('selected', 'selected');

                    $('#share-start-date').val(data.startDate);
                    $('#start-time').val(data.startTime);

                    $('#share-end-date').val(data.endDate);
                    $('#end-time').val(data.endTime);

                    $('#main-div').attr('data-id', data.id);

                    Communication.Proxy.loadVisibleToList(id, function (data) {
                        if (data !== null) {
                            $.each(data, function (i, d) {
                                $('.select2-selection__rendered').append('<li class="select2-selection__choice" title="' + d.value[Communication.lang] + '">' +
                                        '<span class="select2-selection__choice__remove" role="presentation">×</span>' + d.value[Communication.lang] + '</li>');
                                $('#share-visible-to').find('[value="' + d.id + '"]').attr('selected', 'selected');
                            });
                        }
                        Communication.Proxy.loadShareOrgList(id, function (data) {
                            if (data !== null) {
                                $.each(data, function (i, d) {
                                    $('.tree-search').val(d.value[Communication.lang]);
                                    $('.btn.tree-modal').text(d.value[Communication.lang]);
                                    $('.btn.tree-modal').attr('data-id', d.id);
                                    $('#main-div .share-form input[name="orgIdArray"]').val(d.id);
                                });
                            }
                        });
                    });
                });
                $('body').find('.add-new').css('right', '0');
            });
        }
        catch (err) {
            console.error(err);
        }
    });
    
    
    $('body').on('click', '#operation_1000098', function () {
        try {

            if (!$('#buttons_div').attr('data-id')) {
                $.alert({
                    title: Communication.dictionary[Communication.lang]['warning'],
                    content: Communication.dictionary[Communication.lang]['select_information'],
                    theme: 'material'
                });
                return false;
            }

            $.confirm({
                title: Communication.dictionary[Communication.lang]['warning'],
                content: Communication.dictionary[Communication.lang]['delete_info'],
                confirm: function () {
                    Communication.Proxy.removeShare();
                },
                theme: 'black'
            });
        }
        catch (err) {
            console.error(err);
        }
    });
    
    $('body').on('click', '#conversation-list tbody tr', function (e) {
        try {
            var id = $(this).attr('data-id');
            var userId = $(this).attr('data-user-id');
            //parse Share Details
            Communication.Proxy.getConversationDetails(id, function (data) {
                $('.dl-horizontal').html('');
                $('.col-sm-4.info').attr('data-id', id);
                $('.dl-horizontal').append('<label><b> Yaranma tarixi </b>: ' + data.createDate + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Son mesaj tarixi </b>: ' + (data.lastMessageDate ? data.lastMessageDate : '') + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Status </b>: ' + data.status.value[Communication.lang] + '</label> <br/><br/>');
                
                $('.dl-horizontal').append('<label><b> Kim </b>: ' + data.fromUserFullname + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Yazılan mesaj sayı </b>: ' + data.fromMessageCount +'</label> <br/><br/>');
                $('.dl-horizontal').append('<label><b> Kim ilə </b>: ' + data.toUserFullname + '</label> <br/>');
                $('.dl-horizontal').append('<label><b> Yazılan mesaj sayı </b>: ' + data.toMessageCount +'</label> <br/><br/>');
                
            });
            
            $('.main-content-upd #buttons_div').attr('data-id', id);
            $('.main-content-upd #buttons_div').attr('data-user-id', userId);
            $('body').find('.type_2_btns').html(Communication.Service.parseOperations(Communication.operationList, '2'))

            $('body').find('.col-sm-12.data').removeClass('col-sm-12').addClass('col-sm-8');
            $('body').find('.col-sm-4.info').fadeIn(1).css('right', '0');
        }
        catch (err) {
            console.error(err);
        }
    });
    
    $('body').on('click', '#operation_1001341', function () {
        try {

            if (!$('#buttons_div').attr('data-id')) {
                $.alert({
                    title: Communication.dictionary[Communication.lang]['warning'],
                    content: Communication.dictionary[Communication.lang]['select_information'],
                    theme: 'material'
                });
                return false;
            }

            var id = $('#buttons_div').attr('data-id');
            
            
            $.confirm({
                title: Communication.dictionary[Communication.lang]['warning'],
                content: Communication.dictionary[Communication.lang]['delete_info'],
                confirm: function () {
                    Communication.Proxy.removeConversation(id, function(data) {
                        if(data) {
                            $('body').find('.col-sm-4.info').fadeOut(1).css('right', '-100%');
                            $('body').find('.col-sm-8.data').removeClass('col-sm-8').addClass('col-sm-12');
                            $('body #conversation-list tbody tr[data-id="'+id+'"]').remove();
                        }
                    });
                },
                theme: 'black'
            });
        }
        catch (err) {
            console.error(err);
        }
    });
    
    
    $('body').on('click', '#operation_1001342', function () {
        try {
            var id = $(this).parents('.info').attr('data-id');
            $('body').find('.add-new .search-scroll').load('partials/message.html', function () {
                
                $('body').find('.add-new').css('right', '0');
            });
        }
        catch (err) {
            console.error(err);
        }
    });
});



