'use strict';
var typingTimer = '';
var typingInterval = 1000;
var models = [];
$(document).ready(function () {
  $.ajax({
    type: 'GET',
    url: '/api/models',
    headers: {
      'X-Watson-Technology-Preview': '2018-05-01'
    },
    async: true
  })
    .done(function (data) {
      console.log(data);
      models = data.models;
      //console.log("demo.js identifiable",data);
      // langAbbrevList = data.languages;
      // select news option in domain and update dropdown with language selections
      // $('input:radio[name=group1]:nth(1)').prop('checked', true).trigger('click');
      // });
    })
    .fail(function (jqXHR, statustext, errorthrown) {
      console.log(statustext + errorthrown);
    });
  $(document).on('keyup', '#source_text', function (e) {
    $('#sourceLanguage').val('');
    $('#targetLanguage').val('').prop('disabled', true);
    $('#translated_result').val('');

    console.log('typing');
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTyping, typingInterval);
  });
  $(document).on('keydown', '#source_text', function (e) {
    clearTimeout(typingTimer);
  });
  $(document).on('change', '#targetLanguage', function (e) {
    translate();
  });
});

function doneTyping() {
  var text = $('#source_text').val();
  if (text.trim() != '') {

    var restAPICall = {
      type: 'POST',
      url: '/api/identify',
      data: {
        text: text.trim()
      },
      async: true
    };
    $.ajax(restAPICall).done(function (data) {

      var temp = data.languages[0].language;
      $('#sourceLanguage').val(temp);
      $('#targetLanguage').find('option[value!=""]').each(function (ele) {
        var val = $(this).val();
        var temp_model = `${temp}-${val}`;
        
        var ind = models.findIndex(ele=>ele.model_id == temp_model);
        if(ind > -1){
        $(this).prop('disabled', false);
          
        }else{
        $(this).prop('disabled', true);

        }
      });
      $('#targetLanguage').prop('disabled', false);
      // $('#targetLanguage').find('option[value="' + temp + '"]').prop('disabled', true);
    });
  }
  else {
    $('#translated_result').val('');

  }

}

function translate() {
  var target = $('#targetLanguage').val();
  console.log(target, $('#sourceLanguage').val());
  var text = $('#source_text').val();
  text = text.trim();
  if (text != '' && target != '' && $('#sourceLanguage').val() != '') {
    $('#translated_result').val('translating...');
    var callData = {
      // model_id: model_id,
      source: $('#sourceLanguage').val(),
      target: target,
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