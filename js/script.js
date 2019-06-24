    window.onload = function() {
        $('#alert_new_post').hide();
        $('#alert_edit_post').hide();
        $('#alert_delete_post').hide();
        $('#aboutCreator').click(function() {
            $('#aboutAuthor').modal('show');
        });
        $('#closeCreator').click(function() {
            $('#aboutAuthor').modal('hide');
        });
        function PostViewModel() {
            var self = this;
            self.postsURI = 'http://5.9.9.4:5015/posts';
            self.posts = ko.observableArray();
            // self.username = "serchos96";
            // self.password = "975310asd";
            self.username = "";
            self.password = "";
            self.ajax = function(uri, method, data) {
                var request = {
                    url: uri,
                    type: method,
                    contentType: "application/json",
                    accepts: "application/json",
                    cache: false,
                    dataType: 'json',
                    data: JSON.stringify(data),
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization",
                            "Basic " + btoa(self.username + ":" + self.password));
                    },
                    error: function(jqXHR) {
                        console.log("ajax error " + jqXHR.status);
                    }
                };
                return $.ajax(request);
            }
            self.beginAdd = function () {
                if (self.username=="" || self.password=="")
                {
                    self.beginLogin();
                }
                else {
                    $('#newPost').modal('show');
                }
            }
            self.beginEdit = function(post) {
                if (self.username=="" || self.password=="")
                {
                    self.beginLogin();
                }
                else {
                    editPostViewModel.setPost(post);
                    $('#editPost').modal('show');
                }
            }
            self.edit = function(post, data) {
                self.ajax(self.postsURI + "/"+post.id(), 'PUT', data).done(function(res) {
                    self.updatePost(post, res)({
                        success: $("#alert_edit_post").show().delay(3000).fadeOut()
                    })
                });
            }
            self.add = function(post)
            {
                self.ajax(self.postsURI, 'POST', post).done(function(data) {
                    self.posts.unshift({
                        id: ko.observable(data.id),
                        title: ko.observable(data.title),
                        post_text: ko.observable(data.post_text),
                        pub_date: ko.observable(data.pub_date),
                        success: $("#alert_new_post").show().delay(3000).fadeOut()
                    });
                });
            }

            self.remove = function(post) {
                if (self.username=="" || self.password=="")
                {
                    self.beginLogin();
                }
                else {
                self.ajax(self.postsURI + "/"+post.id(), 'DELETE').done(function() {
                    self.posts.remove(post)({
                        success: $("#alert_delete_post").show().delay(3000).fadeOut()
                    });
                    });

                }};
            self.updatePost = function (post, newPost) {
                var i = self.posts.indexOf(post);
                self.posts()[i].title(newPost.title);
                self.posts()[i].post_text(newPost.post_text);
                self.posts()[i].pub_date(newPost.pub_date);
            }
            self.ajax(self.postsURI, 'GET').done(function(data) {
                for (var i = 0; i < data.length; i++) {
                    self.posts.unshift({
                        id: ko.observable(data[i].id),
                        title: ko.observable(data[i].title),
                        post_text: ko.observable(data[i].post_text),
                        pub_date: ko.observable(data[i].pub_date)
                    });
                }
            });
            self.beginLogin = function() {
                $('#login').modal('show');
            }
            self.login = function(username, password) {
                self.username = username;
                self.password = password;
                // self.ajax(self.postsURI, 'GET').done(function(data) {
                //     for (var i = 0; i < data.length; i++) {
                //         self.posts.unshift({
                //             id: ko.observable(data[i].id),
                //             title: ko.observable(data[i].title),
                //             post_text: ko.observable(data[i].post_text),
                //             pub_date: ko.observable(data[i].pub_date)
                //         });
                //     }
                // }).fail(function(jqXHR) {
                //     if (jqXHR.status == 403)
                //         setTimeout(self.beginLogin, 500);
                // });
            }


        }
    function AddPostViewModel() {
        var self = this;
        self.title = ko.observable();
        self.post_text = ko.observable();
        self.pub_date = ko.observable();
        self.addPost = function() {
            $('#newPost').modal('hide');
            postViewModel.add({
                title: self.title(),
                post_text: self.post_text(),
                pub_date: self.pub_date()
            });
            self.title("");
            self.post_text("");
        }
    }
    function EditPostViewModel() {
            var self = this;
            self.title = ko.observable();
            self.post_text = ko.observable();
            self.pub_date = ko.observable();

            self.setPost = function(post) {
                self.post = post;
                self.title(post.title());
                self.post_text(post.post_text());
                $('#editPost').modal('show');
            }

            self.editPost = function() {
                $('#editPost').modal('hide');
                postViewModel.edit(self.post, {
                    title: self.title(),
                    post_text: self.post_text(),
                    pub_date: self.pub_date()
                });
            }
        }
    function LoginViewModel() {
            var self = this;
            self.username = ko.observable();
            self.password = ko.observable();

            self.login = function() {

                postViewModel.login(self.username(), self.password());
                $('#login').modal('hide');
            }
        }

    var postViewModel = new PostViewModel();
    var addPostViewModel = new AddPostViewModel();
    var editPostViewModel = new EditPostViewModel();
    var loginViewModel = new LoginViewModel();
    ko.applyBindings(postViewModel, $('#main')[0]);
    ko.applyBindings(addPostViewModel, $('#newPost')[0]);
    ko.applyBindings(editPostViewModel, $('#editPost')[0]);
    ko.applyBindings(loginViewModel, $('#login')[0]);
    }