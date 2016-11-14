var main = function() {
    'use strict';

    //check player enter username
    $('#loginButton').on('click', function(e) {
        e.preventDefault();
        var username = $('#username').val();
        if(username != '') {
            //disable login-form
            $('#login-form').transition({
                animation: 'fade up',
                onComplete: function() {
                    //show trivia question game
                    $('#game-form').transition('fade down');
                    //display username on header
                    $('#game-form h2 span').html(username);
                }
            });            
        }
    });

    var answerId = 1;

    //enable tab selection
    var previousTab = $('.ui.tab.active.segment');
    $('.vertical.pointing.menu .item').tab({
        'onLoad': function(e){
            var currentTab = $('.ui.tab.active.segment');
            //hide current and show prevous to allow animate
            currentTab.hide();
            previousTab.show();

            //animate to hide prevous tab
            previousTab.transition({
                animation: 'scale',
                //show current tab
                onComplete: function() {
                    currentTab.transition('scale');
                }
            });

            //set current tab to be previous for feature animate
            previousTab = currentTab;
        }
    });

    //get random question
    var getQuestion = function() {
        $.get('/question', function(data) {
            if (data) {
                $('#question').html(data.question);
                answerId = data.answerId;
            } else {
                console.log('No question');
            }
        });
    };

    //get next question
    $('#getQuestionButton').on('click', function() {
        //prevent form to reload page
        $('.ui.form.answer').form({
            onSuccess: function() {
                return false;
            }
        });
        getQuestion();
    });

    //answer button clicked
    $('#answerButton').on('click', function() {
        //answer question form valication
        $('.ui.form.answer').form({
            fields: {
                answer: {
                    identifier  : 'answer',
                    rules: [
                        {
                            type   : 'empty',
                            prompt : 'Please enter your question answer'
                        }
                    ]
                }
            }, 
            onSuccess: function(){
                var answer = $('#answer').val();
                var result;

                var jsonData = JSON.stringify({'answer': answer, 'answerId': answerId});

                $.ajax({
                    url     : '/answer',
                    method  : 'POST',
                    dataType: 'json',
                    contentType: 'application/json',
                    data    : jsonData,
                    success : function(data) {
                        result = data.correct ? 'True':'False';
                        $('.ui.segment.answer h3 span').html(result);
                    },
                    error   : function() {
                        console.log('Error post answer');
                    }
                });            

                //remove question and answer
                $('#answer').val('');
                return false;
            }
        });
    });
    

    //create question validation
    $('.ui.form.question').form({
        fields: {
            question: {
                identifier  : 'question',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter your question'
                    }
                ]
            },
            answer: {
                identifier  : 'answer',
                rules: [
                    {
                        type   : 'empty',
                        prompt : 'Please enter your question answer'
                    }
                ]
            }
        }, 
        onSuccess: function(){
            var question = $('#createQuestion').val(),
                answer = $('#createAnswer').val();

            var jsonData = JSON.stringify({'question': question, 'answer': answer});

            console.log(jsonData);
            
            $.ajax({
                url     : '/question',
                method  : 'POST',
                dataType: 'json',
                contentType: 'application/json',
                data    : jsonData,
                success : function(data) {
                    $('.ui.segment.answer h3 span').html(data.result);
                },
                error   : function() {
                    console.log('Error post answer');
                }
            });
            
            //remove question and answer
            $('#createQuestion').val('');
            $('#createAnswer').val('');
            return false;
        }
    });

    //score tab pressed
    $('.ui.top.tabular.menu a:nth-child(3)').on('click',function() {
        $.get('/score', function(data) {
            if (data) {
                $('#right span').html(data.right);
                $('#wrong span').html(data.wrong);
            } else {
                console.log('Error: no data');
            }
        });
    });
};


$(document).ready(main);