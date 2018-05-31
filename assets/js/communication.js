/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var Communication = {
    // token: 'b2b35e6683f9415e927efe01c998b55c5243f0e59853443e9cdceb2f147c8237',
    lang: 'az',
    appId: 1000013,
    currModule: '',
    operationList: [],
    array: [],
    node: [],
    structureId: '',
    subModuleId: [],
    personId: 0,
    button: '',
    top: 0,
    eduLevels: [],
    universities: [],
    personId:'',
            tempData: {
                form: ''
            },
    Codes: {
        FOREIGN_UNIVERSITY:86
    },
    urls: {
//        ROS: "http://localhost:8080/ROS/",
//        AdminRest: 'http://localhost:8080/AdministrationRest/',
//        HSIS: "http://localhost:8080/UnibookHsisRest/",
//          Chat: 'http://localhost:8080/Chat/',
//        REPORT: 'http://localhost:8080/ReportingRest/'
//        CommunicationRest: 'http://localhost:8080/CommunicationRest/',
        CommunicationRest: 'http://192.168.1.78:8082/CommunicationRest/',
        ROS: "http://192.168.1.78:8082/ROS/",
        AdminRest: 'http://192.168.1.78:8082/AdministrationRest/',
        HSIS: "http://192.168.1.78:8082/UnibookHsisRest/",
        REPORT: 'http://192.168.1.78:8082/ReportingRest/',
        Chat: 'http://192.168.1.78:8082/ChatRest/'
        
       
    },
    statusCodes: {
        OK: 'OK',
        UNAUTHORIZED: 'UNAUTHORIZED',
        ERROR: 'ERROR',
        INVALID_PARAMS: 'INVALID_PARAMS'
    },
    REGEX: {
        email: /\S+@\S+\.\S+/,
        number: /^\d+$/,
        decimalNumber: /^\d+(\.\d+)?$/,
        TEXT: 'text\/plain',
        PDF: 'application\/pdf',
        XLS: 'application\/vnd\.ms-excel',
        XLSX: 'application\/vnd\.openxmlformats-officedocument\.spreadsheetml\.sheet',
        DOC: 'application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document',
        DOCX: 'application\/msword',
        phone: /\(\+\d{3}\)-\d{2}-\d{3}-\d{2}-\d{2}/,
        IMAGE_EXPRESSION: 'image\/jpeg|image\/png',
    },
    MASK: {
        phone: '(+000)-00-000-00-00'
    },
    initToken: function (cname) {
        var name = cname + "=";

        if (document.cookie == name + null || document.cookie == "") {
            window.location.href = '/CommunicationSystem/greeting.html'
        }

        else {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];

                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }

                if (c.indexOf(name) == 0) {
                    Communication.token = c.substring(name.length, c.length);
                }
            }
        }

    },
    initLanguageCookie: function (name) {
        var ca = document.cookie.split(';');

        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];

            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) == 0) {
                Communication.lang = c.substring(name.length, c.length).split('=')[1];
            }
        }

        if (Communication.lang.trim().length === 0) {
            Communication.lang = 'az';
        }
    },
    initCurrentModule: function (name) {
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                var currModule = c.substring(name.length, c.length).split('=')[1];
                return currModule;
            }
        }
        return "";
    },
    loadLanguagePack: function (lang) {
        $.getJSON('assets/js/i18n/' + lang + '.json', function (data) {
            $.each(data, function (i, v) {
                Communication.dictionary[lang][i] = v;
            });
        });
    },
    i18n: function () {
        Communication.initLanguageCookie('lang');
        var attr = '';

        $('[data-i18n]').each(function () {
            attr = $(this).attr('data-i18n');
            $(this).text(Communication.dictionary[Communication.lang][attr]);
            $(this).attr('placeholder', Communication.dictionary[Communication.lang][attr]);
        });
    },
    getCookie: function (cookie_name) {

        var results = document.cookie.match('(^|;) ?' + cookie_name + '=([^;]*)(;|$)');

        if (results)
            return (decodeURI(results[2]));
        else
            return null;

    },
    dictionary: {
        az: {},
        en: {},
        ru: {}
    },
    Proxy: {
        loadApplications: function () {
            $.ajax({
                url: Communication.urls.ROS + 'applications?token=' + Communication.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    Communication.Service.parseApplications(data.data);
                                    Communication.Service.parseApplicationsList(data.data);
                                    $('[data-toggle="tooltip"]').tooltip()
                                    break;

                                case Communication.statusCodes.ERROR:
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:
                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadSubApplications: function (callback) {
            $.ajax({
                url: Communication.urls.ROS + 'applications/1000014/subApplications?token=' + Communication.token,
                type: 'GET',
//                headers: {
//                    'Token': Hsis.token
//                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    if(callback)
                                        callback(data);
                                    break;

                                case Communication.statusCodes.ERROR:
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:
                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        loadModules: function (callback) {
            var modules = {};
            $.ajax({
                url: Communication.urls.ROS + 'applications/' + Communication.appId + '/modules?token=' + Communication.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    modules = data;
                                    break;

                                case Communication.statusCodes.ERROR:
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:
                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(modules);
                }
            });
        },
        loadSubModules: function (moduleId, callback) {

            $.ajax({
                url: Communication.urls.ROS + 'applications/modules/' + moduleId + '/subModules?token=' + Communication.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    callback(data);
                                    break;

                                case Communication.statusCodes.ERROR:
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:
                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }
            });
        },
        getProfile: function () {
            $.ajax({
                url: Communication.urls.ROS + "profile?token=" + Communication.token,
                type: 'GET',
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Communication.statusCodes.ERROR:
                                $.notify(Communication.dictionary[Communication.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Communication.statusCodes.OK:
                                try {
                                    if (data.data) {
                                        var user = data.data;
                                        $('.user-notify-content h6[data-type="name"]').text(user.person.name + ' ' + user.person.surname + ' ' + user.person.patronymic);
                                        // $('.welcome-text p span').text(user.person.name);
                                        $('.user-notify-content p[data-type="role"]').text(user.role.value[Communication.lang]);
                                        $('.user-notify-content p[data-type="org"]').text(user.structure.name[Communication.lang]);
                                        $('.side-title-block p').text(user.orgName.value[Communication.lang]);
                                        $('.main-img img').attr('src', Communication.urls.AdminRest + 'users/' + user.id + '/image?token=' + Communication.token);
                                        $('.side-title-block img').attr('src', Communication.urls.HSIS + 'structures/' + user.orgName.id + '/logo?token=' + Communication.token);
                                        var img = $('.main-img img');
                                        img.on('error', function (e) {
                                            $('.main-img img').attr('src', 'assets/img/guest.png');
                                        })
                                        $('div.big-img img').attr('src', Communication.urls.AdminRest + 'users/' + user.id + '/image?token=' + Communication.token);
                                        $('div.big-img img').on('error', function (e) {
                                            $('div.big-img img').attr('src', 'assets/img/guest.png');
                                        });
                                        Communication.structureId = user.structure.id;
                                    }
                                }
                                catch (err) {
                                    console.error(err);
                                }
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            })
        },
        loadOperations: function (moduleId, callback) {
            var operations = {};
            $.ajax({
                url: Communication.urls.ROS + 'applications/modules/' + moduleId + '/operations?token=' + Communication.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    operations = data.data;
                                    Communication.operationList = operations;
                                    break;

                                case Communication.statusCodes.ERROR:
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:
                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    callback(operations);
                    if ($('#buttons_div').find('ul li').length < 1) {
                        $('#buttons_div').hide();
                        console.log('empty')
                    }
                }
            });
        },
        loadDictionariesByTypeId: function (typeId, parentId, callback) {
            var result = {};
            $.ajax({
                url: Communication.urls.AdminRest + 'settings/dictionaries?typeId=' + typeId + '&parentId=' + parentId + '&token=' + Communication.token,
                type: 'GET',
                global: false,
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Communication.statusCodes.ERROR:
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:

                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {

                    callback(result);
                }

            });
        },
        loadShares: function (page, queryParams, callback) {
            $.ajax({
                url: Communication.urls.CommunicationRest + 'share?token=' + Communication.token + '&orgId=' + Communication.structureId + (queryParams ? '&' + queryParams : '') + (page ? '&page=' + page : ''),
                type: 'GET',
                beforeSend: function (xhr) {
                     $('.module-block[data-id="1000055"]').attr('data-check', '1');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                                $('.notification-parent').notify(Communication.dictionary[Communication.lang]['error'], {position: "bottom center", style: 'red'});
                                break;

                            case Communication.statusCodes.OK:
                                Communication.Service.parseShares(result.data, page);
                                if (callback)
                                    callback(result.data);
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                     $('.module-block[data-id="1000055"]').removeAttr('data-check');
                }
            })
        },
        loadDictionariesListByParentId: function (parentId, callback) {
            var result = {};
            $.ajax({
                url: Communication.urls.AdminRest + 'settings/dictionaries/parentId/' + parentId + '?token=' + Communication.token,
                type: 'GET',
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    callback(data)
                                    break;

                                case Communication.statusCodes.ERROR:
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:

                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                }

            });
        },
        changePassword: function (pass, callback) {
            $.ajax({
                url: Communication.urls.AdminRest + 'users/changePassword?token=' + Communication.token,
                type: 'POST',
                data: pass,
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.OK:
                                callback(result);
                                break;

                            case Communication.statusCodes.INVALID_PARAMS:
                                callback(result);
                                break;

                            case Communication.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Communication.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                }
            });
        },
        getEduYears: function (callback) {
            $.ajax({
                url: Communication.urls.REPORT + 'graphicsReport/year?token=' + Communication.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                                $.notify(Communication.dictionary[Communication.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                            case Communication.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }

                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;


                        }
                    }

                }
            });
        },
        getStructureListByFilter: function (id, levelId, callback) {

            $.ajax({
                url: Communication.urls.HSIS + 'structures/allFilter?token=' + Communication.token,
                type: 'GET',
                data: {
                    parentId: id ? id : 0,
                    levelId: levelId ? levelId : 0
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.OK:

                                if (callback) {
                                    callback(result);
                                }
                                break;

                            case Communication.statusCodes.ERROR:
                                $.notify(Communication.dictionary[Communication.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        getAllCountry: function (callback) {

            $.ajax({
                url: Communication.urls.HSIS + 'structures/allCountry?token=' + Communication.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.OK:
                                if (callback) {
                                    callback(result.data);
                                }
                                break;

                            case Communication.statusCodes.ERROR:
                                $.notify(Communication.dictionary[Communication.lang]['error'], {
                                    type: 'danger'
                                });
                                break;

                        }
                    }
                }
            })
        },
        
        loadOrgTree: function (callback, container) {
            var tree = {};
            $.ajax({
                url: Communication.urls.HSIS + 'structures?token=' + Communication.token,
                type: 'GET',
                global: false,
                beforeSend: function () {
                    if (typeof container !== "undefined") {
                        //                       var obj = $('.small-loading').clone().toggleClass('small-loading tree-preloader').removeClass('hidden');
                        //                       container.before(obj);
                        $('.btn.tree-modal').attr('data-check', 1);
                        NProgress.start();
                    }

                },
                success: function (data) {
                    if (data) {
                        switch (data.code) {
                            case Communication.statusCodes.ERROR:

                                break;

                            case Communication.statusCodes.OK:
                                tree = data.data;
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;

                        }
                    }

                },
                complete: function () {
                    callback(tree);
                    // $('.module-block[data-id="1000009"]').removeAttr('data-check');
                    $('.btn.tree-modal').attr('data-check');
                    NProgress.done();

                }
            });
        },
        loadVisibleToList: function (shareId, callback) {
            var result = {};
            $.ajax({
                url: Communication.urls.CommunicationRest + 'share/visibleToList?token=' + Communication.token,
                type: 'GET',
                data: {
                    shareId: shareId
                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Communication.statusCodes.ERROR:
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:
                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(result);
                    }
                }

            });
        },
        loadShareOrgList: function (shareId, callback) {
            var result = {};
            $.ajax({
                url: Communication.urls.CommunicationRest + 'share/shareOrgList?token=' + Communication.token,
                type: 'GET',
                data: {
                    shareId: shareId
                },
                success: function (data) {
                    try {
                        if (data) {
                            switch (data.code) {
                                case Communication.statusCodes.OK:
                                    result = data.data;
                                    break;

                                case Communication.statusCodes.ERROR:
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                    break;

                                case Communication.statusCodes.UNAUTHORIZED:
                                    window.location = Communication.urls.ROS + 'unauthorized';
                                    break;
                            }
                        }
                    }
                    catch (err) {
                        console.error(err);
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(result);
                    }
                }

            });
        },
        addShare: function (formData) {
            $.ajax({
                url: Communication.urls.CommunicationRest + 'share/add?token=' + Communication.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('#main-div #confirmShare').attr('disabled', 'disabled');
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.OK:
                                $.notify(Communication.dictionary[Communication.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Communication.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Communication.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmShare').removeAttr('disabled');
                }
            });
        },
        editShare: function (formData) {
            $.ajax({
                url: Communication.urls.CommunicationRest + 'share/edit?token=' + Communication.token,
                type: 'POST',
                data: formData,
                beforeSend: function (xhr) {
                    $('#main-div #confirmShare').attr('disabled', 'disabled')
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.OK:
                                $.notify(Communication.dictionary[Communication.lang]['success'], {
                                    type: 'success'
                                });
                                break;

                            case Communication.statusCodes.ERROR:
                                if (result.message) {
                                    $.notify(result.message[Communication.lang], {
                                        type: 'danger'
                                    });
                                }
                                else {
                                    $.notify(Communication.dictionary[Communication.lang]['error'], {
                                        type: 'danger'
                                    });
                                }
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;

                        }
                    }
                },
                complete: function () {
                    $('#main-div #confirmShare').removeAttr('disabled');
                }
            });
        },
        getShareDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Communication.urls.CommunicationRest + 'share/' + id + '?token=' + Communication.token + '&orgId=' + Communication.structureId,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                                $('.notification-parent').notify(Communication.dictionary[Communication.lang]['error'], {position: "bottom center", style: 'red'});
                                break;

                            case Communication.statusCodes.OK:
                                data = result.data;
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },
        getConversationDetails: function (id, callback) {
            var data = {};
            $.ajax({
                url: Communication.urls.Chat + 'conversation/' + id + '?token=' + Communication.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                                $('.notification-parent').notify(Communication.dictionary[Communication.lang]['error'], {position: "bottom center", style: 'red'});
                                break;

                            case Communication.statusCodes.OK:
                                data = result.data;
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                },
                complete: function () {
                    if (callback) {
                        callback(data);
                    }
                }
            });
        },
        
        removeConversation: function (id, callback) {
            var data = {};
            $.ajax({
                url: Communication.urls.Chat + 'conversation/' + id + '/remove?token=' + Communication.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                                $('.notification-parent').notify(Communication.dictionary[Communication.lang]['error'], {position: "bottom center", style: 'red'});
                                break;

                            case Communication.statusCodes.OK:
                                $.notify(Communication.dictionary[Communication.lang]['success'], {
                                        type: 'success'
                                    });
                                    
                                    if(callback) 
                                        callback(result);
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }
                    }
                }
            });
        },
        removeShare: function () {

            var id = $('.main-content-upd #buttons_div').attr('data-id');
            $.ajax({
                url: Communication.urls.CommunicationRest + 'share/' + id + '/remove?token=' + Communication.token,
                type: 'POST',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                            $.notify(Communication.dictionary[Communication.lang]['error'], {
                                type: 'error'
                            });
                                break;

                            case Communication.statusCodes.OK:
                                if (result.message) {
                                    $.notify(result.message[Communication.lang]['success'], {
                                        type: 'success'
                                    });
                                }
                                else {
                                    $.notify(Communication.dictionary[Communication.lang]['success'], {
                                        type: 'success'
                                    });
                                }
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                    $('.main-content-upd #buttons_div').removeAttr('data-id');
                    Communication.Proxy.loadShares();
                }
            })
        },
        getAllConversationList: function (page, form, callback) {

            $.ajax({
                url: Communication.urls.Chat + 'conversation/alllist?token=' + Communication.token,
                type: 'GET',
                beforeSend: function (xhr) {
                     $('.module-block[data-id="1000121"]').attr('data-check', '1');
                    
                },
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                            $.notify(Communication.dictionary[Communication.lang]['error'], {
                                type: 'error'
                            });
                                break;

                            case Communication.statusCodes.OK:
                                
                                    Communication.Service.parseAllConversation(result.data, page)
                                    if(callback) {
                                        callback(result);
                                    }
                                    
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                },
                complete: function () {
                     $('.module-block[data-id="1000121"]').removeAttr('data-check');
                }
            })
        },
        getConversationMessage: function (id, callback) {

            $.ajax({
                url: Communication.urls.Chat + 'conversation/'+id+'/message/admin?token=' + Communication.token,
                type: 'GET',
                success: function (result) {
                    if (result) {
                        switch (result.code) {
                            case Communication.statusCodes.ERROR:
                            $.notify(Communication.dictionary[Communication.lang]['error'], {
                                type: 'error'
                            });
                                break;

                            case Communication.statusCodes.OK:
                                
                                    if(callback) {
                                        callback(result);
                                    }
                                    
                                break;

                            case Communication.statusCodes.UNAUTHORIZED:
                                window.location = Communication.urls.ROS + 'unauthorized';
                                break;
                        }


                    }
                }
            })
        },
    },
    Service: {
        parseApplications: function (applications) {
            var html = '';
            $.each(applications, function (i, v) {
                html += '<div class="col-md-4 p-l-0" title = "' + v.name[Communication.lang] + '">' +
                        '<li class="button-item">' +
                        '<a data-id="' + v.id + '" target="_blank" class="button-icon" href="' + v.url + '?token=' + Communication.token + '">' +
                        '<div class="flex-center">' + '<div class="' + v.iconPath + '"></div>' +
                        '<span class="button-name">' + v.shortName[Communication.lang] + '</span>' +
                        '</div>' +
                        '</a>' +
                        '</li>' +
                        '</div>';
            });

            $('#application-list .div-application').html(html);
        },
        parseApplicationsList: function (data) {
            var html = '';
            if (data) {
                $.each(data, function (i, v) {
                    if(v.id == 1000001)
                        html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Communication.lang] + '">' + 
                                    '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Communication.token + '">' + v.shortName[Communication.lang] + '</a>' + 
                                '</li>';
                });
                Communication.Proxy.loadSubApplications(function(data) {
                    if(data && data.data) {
                        $.each(data.data, function (i, v) {
                            html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Communication.lang] + '">' + 
                                        '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Communication.token + '">' + v.shortName[Communication.lang] + '</a>' + 
                                    '</li>';
                        })
                    }
                    
                    $('.app-con').html(html);
                    $('.app-con a[data-id="' + Communication.appId + '"]').parent('li').addClass('active');
                    $('[data-toggle="tooltip"]').tooltip()

                    var moduleListItems = $('body').find('.app-con li');
                    console.log(moduleListItems)
                    if (moduleListItems.length > 5) {
                        $('body').find('div.app-list, .hide-menu').addClass('less-menu')
                    } else {
                        $('body').find('div.app-list, .hide-menu').removeClass('less-menu')
                    }

                })
                
            }

        },
//        parseApplicationsList: function (data) {
//            var html = '';
//            if (data) {
//                $.each(data, function (i, v) {
//                    html += '<li data-toggle="tooltip" data-placement="bottom" title = "' + v.name[Communication.lang] + '">' + '<a data-id="' + v.id + '"  href="' + v.url + '?token=' + Communication.token + '">' + v.shortName[Communication.lang] + '</a>' + '</li>';
//                });
//                $('.app-con').html(html);
//                $('.app-con a[data-id="' + Communication.appId + '"]').parent('li').addClass('active');
//            }
//
//        },
        parseModules: function (modules) {
            var html = '';
            if (modules.data) {
                $.each(modules.data, function (i, v) {
                    if (v.parentId == 0) {
                        html += '<li title="' + v.name[Communication.lang] + '" data-id="' + v.id + '" class="module-block">' +
                                '<a class="icon-' + v.iconPath + '" >' + v.shortName[Communication.lang] +
                                '</a></li>';
                    }

                });
            }

            return html;
        },
        parseOperations: function (operations, type, $obj, callback) {
            var html = '';
            if (operations) {
                var innerButton = $('<div class="dropdown-func op-cont">' +
                        '<div title = "Əməliyyatlar" class="operations operations-top dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                        '<img src="assets/img/upd/table-dots.svg">' +
                        '</div>' + '<ul class="dropdown-menu">' +
                        '</ul>' +
                        '</div>');

                $.each(operations, function (i, v) {
                    if (v.typeId == type) {
                        if (type == '1') {
                            html += '<li><a id="operation_' + v.id + '" href="#" >' + v.name[Communication.lang] + '</a></li>';

                        }
                        else if (type == '2') {
                            if ($obj) {
                                var statusId = $obj.status ? $obj.status.id : 0;
                                if ((v.id == 1000042 || v.id == 1000041) && statusId == 1000340) {
                                    html += '';
                                }
                                else if ((v.id == 1000028 || v.id == 1000032) && statusId == 1000340 && v.roleId != 1000020 && v.roleId != 1000075) {
                                    html += '';
                                } else {
                                    html += '<li><a  id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Communication.lang] + '</a></li>';
                                }
                            }
                            else {
                                html += '<li><a id="operation_' + v.id + '" data-status = "' + statusId + '" href="#">' + v.name[Communication.lang] + '</a></li>';
                            }
                        }
                    }
                });

                if (type == '2') {

                    innerButton.find('ul').html(html);
                    return innerButton.html();
                }

            }
            return html;
        },
        parseDictionaryForSelect: function (data) {
            var html = '<option value="0">' + Communication.dictionary[Communication.lang]["select"] + '</option>';
            if (data) {
                $.each(data, function (i, v) {
                    html += '<option parent="' + v.parentId + '" code="' + v.code + '" value="' + v.id + '">' + v.value[Communication.lang] + '</option>';
                });

            }
            return html;
        },
        
        parseShares: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #share-list tbody tr').length;
                }
                else {
                    count = 0;
                }

                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" >' +
                            '<td>' + (++count) + '</td>' +
                            '<td>' + v.type.value[Communication.lang] + '</td>' + '<td style="white-space:pre-line;">' + (((v.content).substr(0, 100)).length == 100 ? (v.content).substr(0, 100) + '...' : v.content) + '</td>' +
                            '<td>' + v.priority.value[Communication.lang] + '</td>' +
                            '<td>' + v.startDate + ' ' + v.startTime + '</td>' +
                            '<td>' + v.endDate + ' ' + v.endTime + '</td>' +
                            // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                            '</tr>';
                });

                if (page) {
                    $('body').find('#share-list tbody').append(html);
                }
                else {
                    $('body').find('#share-list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="share" class="btn loading-margins btn-load-more">' + Communication.dictionary[Communication.lang]["load.more"] + '</button>');
                }

            }
        },
        
        parseAllConversation: function (data, page) {
            if (data) {
                var html = '';
                var count;

                if (page) {
                    count = $('.main-content-upd #conversation-list tbody tr').length;
                }
                else {
                    count = 0;
                }

                $.each(data, function (i, v) {
                    html += '<tr data-id="' + v.id + '" data-user-id="'+v.conversation.createUser.id+'" >' +
                            '<td>' + (++count) + '</td>' +
                            '<td>' + (v.conversation.createUser.surname + ' ' + v.conversation.createUser.name + ' '  + v.conversation.createUser.patronymic + ' - ' + v.conversation.createUser.orgName) +'</td>' +
                            '<td>' + (v.user.surname + ' ' + v.user.name + ' '  + v.user.patronymic + ' - ' + v.user.orgName)+ '</td>' +
                            '<td>' + (v.status ? v.status : '') +'</td>' +
                            '<td>' + v.conversation.createDate + '</td>' +
                            // '<td>' + Hsis.Service.parseOperations(Hsis.operationList, '2', v) + '</td>' +
                            '</tr>';
                });

                if (page) {
                    $('body').find('#conversation-list tbody').append(html);
                }
                else {
                    $('body').find('#conversation-list tbody').html(html);
                }

                if ($('#main-div #load_more_div').children().length == 0) {
                    $('#main-div #load_more_div').html('<button  data-table="conversation" class="btn loading-margins btn-load-more">' + Communication.dictionary[Communication.lang]["load.more"] + '</button>');
                }

            }
        },
        commonParseTree: function (data, objectId, nodeTypeId) {
            try {
                var array = [];
                if (data.length > 0) {

                    $.each(data, function (i, v) {
                        var obj = {
                            id: v.id.toString(),
                            parent: (v.parent.id == 0) ? "#" : v.parent.id.toString(), text: v.name[Communication.lang],
                            typeId: v.type.id
                        };
                        array.push(obj);
                        Communication.array.push(obj);
                    });
                    $('#main-div').find('#' + objectId).on('loaded.jstree', function (e, data) {
                        $('.tree-preloader').remove();
                        $('#' + objectId).removeAttr('data-id');
                        $('#' + objectId).removeAttr('data-check');

                    })
                            .jstree({
//                                'conditionalselect' : function(node) {
//                                    if(nodeTypeId) {
//                                        return node.original.typeId == nodeTypeId ? true : false;
//                                    }
//                                    else {
//                                        return true;
//                                    }
//                                    
//                                },
                                "core": {
                                    "data": array,
                                    "check_callback": true,
                                    "themes": {
                                        "variant": "large",
                                        "dots": false,
                                        "icons": true
                                    },
                                },
                                "search": {
                                    "case_insensitive": true,
                                    "show_only_matches": true
                                },
                                "plugins": ["conditionalselect", "wholerow", "search"],
                                "themes": {"stripes": true}
                            });
                }
                else {
                    $('#main-div').find('#' + objectId).jstree("destroy");
                }
            }
            catch (err) {
                console.error(err);
            }
        },
        
    },
    Validation: {
        validateEmail: function (email) {
            var re = Communication.REGEX.email;
            return re.test(email);
        },
        validateNumber: function (number) {
            var re = Communication.REGEX.number;
            return re.test(number);
        },
        validatePhoneNumber: function (phone) {
            var re = Communication.REGEX.phone;
            return re.test(phone);
        },
        validateDecimalNumber: function (number) {
            var re = Communication.REGEX.decimalNumber;
            return re.test(number);
        },
        validateRequiredFields: function (requiredAttr) {
            var required = $('[' + requiredAttr + ']');

            var requiredIsEmpty = false;

            required.each(function (i, v) {
                if (v.value.length == 0 || (requiredAttr !== 'default-teaching-required' && requiredAttr !== 'default-required' && v.value == 0 && $(this).is('select'))) {
                    $(v).addClass('blank-required-field');

                    if (!requiredIsEmpty) {

                        $.notify(Communication.dictionary[Communication.lang]['required_fields'], {
                            type: 'warning'
                        });
                        requiredIsEmpty = true;
                    }

                    $(v).on('focusout', function (e) {
                        if (v.value.length && $(v).hasClass('blank-required-field')) {
                            $(v).removeClass('blank-required-field');
                            $(v).off('focusout');
                        }
                    });
                }
            });

            return !requiredIsEmpty;
        },
        checkFile: function (contentType, fileType) {
            var result = contentType.match(fileType);
            if (result) {
                return true;
            }
            else {

                return false;
            }
        }
    }

};

var fileTypes = {
    IMAGE_CONTENT_TYPE: '^(' + Communication.REGEX.IMAGE_EXPRESSION + ')$',
    FILE_CONTENT_TYPE: '^(' + Communication.REGEX.TEXT + '|' + Communication.REGEX.PDF + '|' + Communication.REGEX.XLS + '|' + Communication.REGEX.XLSX + '|' + Communication.REGEX.DOC + '|' + Communication.REGEX.DOCX + '|' + Communication.REGEX.IMAGE_EXPRESSION + ')$'
};


