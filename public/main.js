'use strict';
var typingTimer = '';
var typingInterval = 1000;
$(document).ready(function () {

    $(document).on('keyup', '#source_text', function (e) {
        let val = $(this).val();

        $('#translated_result').val('');
        if (val.trim() != '') {

        }
        console.log('typing');
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, typingInterval);
    })
    $(document).on('keydown', '#source_text', function (e) {
        clearTimeout(typingTimer);
    });
    $(document).on('change', '#targetLanguage', function (e) {
        doneTyping();
    });
});

function doneTyping() {
    let text = $('#source_text').val();
    let target = $('#targetLanguage').val();
    if (text.trim() != '' && target != '') {
        $('#translated_result').val('translating...');
        var callData = {
            // model_id: model_id,
            source:'en',
            target:target,
            text: text
          };
        var restAPICall = {
            type: 'POST',
            url: '/api/translate',
            data: callData,
            dataType: 'json',
            headers: {
                'X-Watson-Technology-Preview': '2018-05-01'
            },
            async: true
        };
        
        $.ajax(restAPICall)
            .done(function (data) {
                // $('#home2 textarea').val(data['translations'][0]['translation']);
                // $('#profile2 textarea').val(JSON.stringify(data, null, 2));
                $('#translated_result').val(data['translations'][0]['translation']);

            })
            .fail(function (jqXHR, statustext, errorthrown) {
                $('#translated_result').val('translation error');
                
                console.log(statustext + errorthrown);
            });

    }else{
        $('#translated_result').val('');

    }

}