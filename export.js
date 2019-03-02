var gun = Gun();

/* --------------------- */
/* this part is for export page */
/* while user click my wordbook on extension popup.*/
/* --------------------- */
function loadVocabulary() {
  gun.get('wordbook-extension').get('unkonw-words').map().on(function(data){
    if(data.status != 'unknow')return;

    UI(data);
  })
}

function UI(data){
  console.log(data);
  $('.book').append(
    //"<li><div class='row'><div class='col-md-3'>"+data.english+"</div><div class='col-md-6 div-url'><a href='"+data.url+"'>"+data.url+"</a></div>"+"<div class='col-md-3'>"+data.time+"</div></li>"
    "<p id='li-"+data.time+"'>"+data.english+" <button id='"+data.time+"' class='btn btn-success'>很熟</button> <button id='delete-"+data.time+"' class='btn btn-danger'>删除</button> </p>"
  );
  //add event handler for pass the word
  $( "#"+data.time ).click(function() {
    passWord(data.time);
  });
  //add event handler for delete the word
  $( "#delete-"+data.time ).click(function() {
    deleteWord(data.time);
  });
}

function passWord(el_id){
  gun.get('wordbook-extension').get('unkonw-words').map().once(function(data){
    if(data.time != el_id){
      return;
    }else{
      //make the word from unknow to known.
      this.put({status:'known'},function(){
        //update UI
        removeUI(el_id);
      });
    }
  });
}

function deleteWord(el_id){
  gun.get('wordbook-extension').get('unkonw-words').map().once(function(data){
    if(data.time != el_id){
      return;
    }else{
      //make the word from unknow to delete.
      this.put({status:'deleted'},function(){
        //update UI
        removeUI(el_id);
      });
    }
  });
}

function removeUI(el_id){
  $('#li-'+el_id).remove();
}
/* --------------------- */


/* --------------------- */
/* this part is for ramdom page */
/* while user open newtab override.*/
/* --------------------- */
async function getWords(){
  var words = []
  await gun.get('wordbook-extension').get('unkonw-words').map(function(data){
    if(data.status != 'unknow')return;

    words.push({
      english:data.english,
      count:data.count + 1,
      url:data.url,
      time:data.time
    });
  })
  console.log(words.length);
  return words;
}

function random(items){
  var item = items[Math.floor(Math.random()*items.length)];
  console.log(item)
  return item;
}

async function randomWord(){
  var words = await getWords()
  var word = random(words);
  console.log(word);
  remindUI(word);
}

function remindUI(word){
  if(word.english.length > 5){
    //alert('need to change font size')
    $('#s-text').css({"font-size":"1em"})
  }
  console.log(word.english);
  $('#vocabulary').append(word.english);
  $('#vocabulary-back').append(word.english);
  $('#word-count').append(word.count);
  translate(word.english);
}

function translate(word){
  var baseurl1 = "http://dict.cn/"
  var baseurl = "https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/"
  const Http = new XMLHttpRequest();
  var url = baseurl1 + word
  Http.open("GET", url);
  Http.send();

  Http.onreadystatechange=(e)=>{
    console.log(Http.responseText)
    var content = extractFromHtml(Http.responseText);
    if($('#fanyi-chinese').html().length < 1){
      $('#fanyi-chinese').append(content);
    }
  }
}

function extractFromHtml(html){
  var el = $( '<div></div>' );
  el.html(html);
  //console.log(el)
  var content = $('.dict-basic-ul', el).text();
  console.log(content.split('if')[0]);
  return content.split('if')[0]
}
console.log(window.location.href)
if(window.location.href.includes('remind.html')){
    randomWord();
}
else{
  loadVocabulary();
}
