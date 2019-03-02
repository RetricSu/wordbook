var gun = Gun()

chrome.extension.onMessage.addListener(async function(request, sender, sendResponse) {
    switch (request.command) {
        case 'setItem':
            gunStore(request.data)
            return;
        case 'getItem':
            await gunFetch(sendResponse);
            return;
    }
});

async function gunStore(data){
  await cleanStore(data);
  console.log(data);
}

async function cleanStore(word){
  var isDuplicate = false;
  await gun.get('wordbook-extension').get('unkonw-words').map(function(data){
          if(!data)return;
          if(data.english != word.english)return;

          isDuplicate = true;
    });

    if(!isDuplicate){
      gun.get('wordbook-extension').get('unkonw-words').set(word);
    }else {
      //already store, just add the word count plus 1.
      addCount(word);
      console.log('重复的单词，增加一次计数..');
    }
}

function addCount(word){
  gun.get('wordbook-extension').get('unkonw-words').map().once(function(data){
          if(!data)return;
          if(data.english != word.english)return;

          this.put({count:data.count+1});
    });
}

async function gunFetch(sendResponse){
  var datalist = []
  await gun.get('wordbook-extension').get('unkonw-words').map().once(async function(data){
    await datalist.push(data);
    console.log(data);
  })
  await sendResponse(datalist);
}

async function getWords(){
  var words = []
  await gun.get('wordbook-extension').get('unkonw-words').map(function(data){
    words.push({
      english:data.english,
      url:data.url,
      time:data.time
    });
  })
  console.log(words.length);
  return words;
}
