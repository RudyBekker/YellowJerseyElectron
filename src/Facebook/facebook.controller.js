'use strict';

var fetch = require('node-fetch');

exports.getFacebookGroupPosts = getFacebookGroupPosts;
exports.getFacebookMembersDetail = getFacebookMembersDetail;
var token = ""


function getFacebookGroupPosts(windowScreen) {
    windowScreen.webContents.executeJavaScript(`
    window.$ = document.querySelectorAll.bind(document);

    var groupUrl = '';
    var setTimeoutId;
    var postList = sessionStorage.getItem('postList');
    postList = postList ? JSON.parse(postList) : [];
    var extractorIsStart = sessionStorage.getItem('isStart');
    console.log(extractorIsStart)
    if(extractorIsStart) groupPostExtractorStart();

    if($('div.bp') && $('div.bp').length && !document.getElementById('hammer')){

        var groupPostExtractor = document.createElement("img");
        groupPostExtractor.setAttribute('src','https://img.icons8.com/emoji/452/hammer-and-pick.png');
        groupPostExtractor.setAttribute('width','25px');
        groupPostExtractor.setAttribute('id','hammer');
        groupPostExtractor.setAttribute('height','25px');
        groupPostExtractor.style['margin-bottom'] = '-6px';
        groupPostExtractor.style['margin-left'] = '5px';
        $('div.bp')[0].append(groupPostExtractor);

        const postElement = document.getElementById('hammer');

        if (postElement && postElement.getAttribute('listener') !== 'true') {
            postElement.addEventListener('click', function(event){
                sessionStorage.removeItem('postList')
                if(sessionStorage.getItem('isStart')){
                    totalPostDetails(postList);
                    clearTimeout(setTimeoutId);
                }else{
                    sessionStorage.setItem('isStart',true);
                    groupPostExtractorStart();
                }
            })
        }   
    }


    function groupPostExtractorStart(){
        window.$ = document.querySelectorAll.bind(document)
        let getAllArticlesList = $('div#m_group_stories_container>section');
        if (getAllArticlesList.length) getAllArticlesList = getAllArticlesList[0].getElementsByTagName('article');
        for (let i = 0; i <= getAllArticlesList.length - 1; i++) {
            if (getAllArticlesList[i] && getAllArticlesList[i].getElementsByTagName('footer')[0]) {
                let postAuthor = getAllArticlesList[i].getElementsByTagName('header')[0].getElementsByTagName('strong')[0].innerText;
                let postAuthorUrl = getAllArticlesList[i].getElementsByTagName('header')[0].getElementsByTagName('a')[0].href;
                let postContent = getAllArticlesList[i].getElementsByTagName('div')[2].innerText;
                let urls = getAllArticlesList[i].getElementsByTagName('footer')[0].getElementsByTagName('a');
                let postUrl = Array.prototype.slice.call(urls).filter(el => el.textContent.trim().includes('Full Story'))[0].href;
                let commentCount = Array.prototype.slice.call(urls).filter(el => el.textContent.trim().includes('Comment'))[0];
                if (commentCount) commentCount = commentCount.innerText.split("Comment")[0] ? commentCount.innerText.split("Comment")[0] : 0;
                let shareCount = Array.prototype.slice.call(urls).filter(el => el.textContent.trim().includes('Share'))[0];
                if (shareCount) shareCount = shareCount.innerText.split("Share")[0] ? shareCount.innerText.split("Share")[0] : 0;
                let likeCount = getAllArticlesList[i].getElementsByTagName('footer')[0].getElementsByTagName('a')[0].innerText;
                let postTimestamp = getAllArticlesList[i].getElementsByTagName('footer')[0].getElementsByTagName('abbr')[0].innerText;
                groupUrl = postUrl.split("/permalink/")[0];
                let postId = postUrl.split("permalink/")[1];
                postId = postId.split("/?")[0];
                postList.push({
                    postId: postId,
                    postAuthor: postAuthor,
                    postContent: postContent,
                    postAuthorUrl: postAuthorUrl,
                    postUrl: postUrl,
                    likeCount: /^\d+$/.test(likeCount) ? likeCount : 0,
                    commentCount: commentCount ? commentCount : 0,
                    postTimestamp: postTimestamp,
                    shareCount: shareCount ? shareCount : 0
                })
            }
        }
        console.log(postList);
        openProgressModal(postList);
        setTimeoutId = setTimeout(() => {
            sessionStorage.setItem('postList', JSON.stringify(postList));
            let seeMorePosts = Array.prototype.slice.call(document.getElementsByTagName('a')).filter(el => el.textContent.includes('See More'));
            console.log('seemoreposts-->', seeMorePosts);
            if (seeMorePosts.length && postList.length < 1000) seeMorePosts[0].click();
            else totalPostDetails(postList)
        }, 20000);
    }

    function openProgressModal(postList){
        var createProgressElement = document.createElement('div');
        createProgressElement.innerHTML = '<div class="modal" id="progress">'
         + '<div class="header">'
         + '  <h3 id="title">Processing...</h3>'
         + '<a id="hidePopup" class="cancel">x</a>'
         + '</div>'
         + '<div class="content">'
         + '  <form>'
         + '    <div>'
         + '      <span class="progress-status" id="progressTask" for="cars"></span>'
         + '    </div>'
         + '    <div class="btns">'
         + '      <button id="cancelProgress">Abort</button>'
         + '      <button class="cancel" id="viewProcessing" style="background: #6b6b6b;border: 1px solid #6b6b6b;">Processing...</button>'
         + '    </div>'
         + '  </form>'
         + '</div>'
         + '</div>'

         document.body.appendChild(createProgressElement);
         var progressSheet = document.createElement('style')
         progressSheet.innerHTML = ".main{   width: 100%;   height: 100vh;   text-align: center; } .main div{   width: 400px;   height: 400px;   margin:0 auto;   text-align: center; } .main div button{   top: 500px;   height: 30px;   margin: 0 auto; } .container{   display: none;   width: 100%;   height: 100vh;   position: fixed;   opacity: 0.9;   background: #222;   z-index: 40000;   top:0;   left: 0;   overflow: hidden;   animation-name: fadeIn_Container;   animation-duration: 1s;    } .modal{   display:none;   top: 0;   min-width: 250px;   width: 80%;   height: auto;   margin: 0 auto;   position: fixed;   z-index: 40001;   background: #fff;   border-radius: 10px;   box-shadow: 0px 0px 10px #000;   margin-top: 30px;   margin-left: 10%;   animation-name: fadeIn_Modal;   animation-duration: 0.8s; } .header{   width: 100%;   height: auto;   border-radius: 10px 10px 0px 0px;   position: relative; } .header h3{       margin: 10px 30px; } .header a{   text-decoration: none;   float: right;   line-height: 70px;   margin-right: 20px;   color: #aaa;   position: absolute;   right: 0px;   top: 0px;   padding: 12px; } .content{   width: 100%;   height: auto; } form{   margin-top: 20px; } form label{   display: block;   margin-left: 12%;   margin-top: 10px;   font-family: sans-serif;   font-size: 1rem; } form input{   display: block;   width: 75%;   margin-left: 12%;   margin-top: 10px;   border-radius: 3px;   font-family: sans-serif; } #first_label{   padding-top: 30px; } #second_label{   padding-top: 25px; } .footer{   width: 100%;   height: auto;   border-radius: 0px 0px 10px 10px;   text-align: left; } .fotter button{   float: right;   margin-right: 10px;   margin-top: 18px;   text-decoration: none;  } /****MEDIA QUERIES****/ @media screen and (min-width: 600px){   .modal{     width: 500px;     height: auto;     margin-left: calc(50vw - 250px);     margin-top: calc(50vh - 150px);   }   .header{     width: 100%;     height: auto;   }   .header a{     line-height: 0px;     margin-right: 10px;   }   .content{     width: 100%;     height: auto;   }   form label{     margin-left: 0px;     margin-top: 10px;     margin-bottom: 10px;   }   form input{     width: 75%;     margin-left: 0%;     margin-top: 10px;   }   #first_label{     padding-top: 0px;   }   #second_label{     padding-top: 0px;   }   .footer{     width: 100%;     height: auto;      }   .footer a{      color: #000;   text-align: left;       display: inline-block;     padding: 0px 30px 24px;   } } /*LARGE SCREEN*/ @media screen and (min-width: 1300px){ } /****ANIMATIONS****/ @keyframes fadeIn_Modal {   from{     opacity: 0;   }   to{     opacity: 1;   } } @keyframes fadeIn_Container {   from{     opacity: 0;   }   to{     opacity: 0.9;   } } form{   margin: 20px 30px; } form select{       width: 100%;     height: 35px; } form .src-cls{   width: 100%;   height: 30px;   border: 1px solid #000;   font-size: 15px; } .btns{   display: inline-flex;     width: 100%;     margin-top: 17px; } form .btns button{   width: 50%;   height: 35px;   text-align: center;   border-radius: 3px;   border: 1px solid #000; } form .btns button:nth-child(2){   background: #000;   color: #fff;   margin-left: 5px; } form .btns button:nth-child(1){   background: #fff;   color: #000;   margin-right: 5px;    } /*progress bar*/ .progress-status{   background: rgba(0, 0, 255, 0.21);     font-size: 14px;     display: inline-block;     padding: 1px 8px;     border: 1px solid rgba(7, 19, 171, 1);     border-radius: 16px;     color: #0713ab; } .progress-percent{   text-align: right;   font-size: 14px;   display: inline-block;   color: #0713ab;   float: right; } .meter {    height: 10px;   position: relative;   background: #cac8fd;   border-radius: 5px;   padding: 0px;   box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);       margin-top: 9px; } .meter > span {   display: block;   height: 100%;   border-top-right-radius: 8px;   border-bottom-right-radius: 8px;   border-top-left-radius: 20px;   border-bottom-left-radius: 20px;   background-color: rgb(31 80 171);   background-image: linear-gradient(     center bottom,     rgb(43,194,83) 37%,     rgb(84,240,84) 69%   );   box-shadow:      inset 0 2px 9px  rgba(255,255,255,0.3),     inset 0 -2px 6px rgba(0,0,0,0.4);   position: relative;   overflow: hidden; }";
         
         document.body.appendChild(progressSheet);
         let openProgressModel = document.getElementById('progress')
         openProgressModel.style.display = "block";
         document.getElementById('cancelProgress').style.cursor = "pointer";
         document.getElementById('hidePopup').addEventListener('click',function(event){
            event.preventDefault();
            openProgressModel.style.display = 'none';
            window.location.reload();
        })   
        
        let progressTaskElement = document.getElementById('progressTask');
        progressTaskElement.innerText = "Task in progress: " + postList.length + " Posts Scanned"
         document.getElementById('cancelProgress').addEventListener('click',function(event){
             event.preventDefault();
             totalPostDetails(postList);
         })
    }

        function totalPostDetails(posts) {
            let postRequests;
            if (document.getElementsByTagName('header').length) {
                postRequests = {
                    groupName: document.getElementsByTagName('header')[0].getElementsByTagName('h1')[0].innerText,
                    groupUrl: groupUrl,
                    post: posts
                }
            }            
            console.log('totalPostExtractor-->', JSON.stringify(postRequests));
            scrappedPostDataCompleted(posts)
        }

        function scrappedPostDataCompleted(posts){
            clearTimeout(setTimeoutId);
            document.getElementById('title').innerText = "Done";
            let progressTaskElement = document.getElementById('progressTask');
            progressTaskElement.innerText = "Task is completed: "+ posts.length +" Posts Scanned";
            progressTaskElement.style.background = "#DEE9FF";
            let viewProcessing = document.getElementById('viewProcessing');
            document.getElementById('cancelProgress').style.display = "none";
            viewProcessing.innerText = "View groups";
            viewProcessing.style.background = "";
            viewProcessing.style.cursor = "pointer";
            viewProcessing.style['margin-left'] = "25%";
            viewProcessing.addEventListener('click', function(event){
                event.preventDefault();
                window.location.href = "https://discover360.app/groups";
            })
        }
        
    `)
}

function facebookGroupPostPageLoaded(windowScreen, token) {
    let currentURL = windowScreen.webContents.getURL();
    console.log('loaded---->', currentURL)
    token = token;
    fetch('https://discover360.app/api/projects', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        }
    })
        .then(response => response.json())
        .then(async (projectList) => {
            console.log('pro->', projectList)
            if (projectList && projectList.data && projectList.data.length){
                await addIconsScript(windowScreen);
                return addProjectListInPopup(projectList.data, windowScreen);            
            }


        })
        .catch((error) => console.log(error));


}

function addProjectListInPopup(projectList, windowScreen) {
    if (!projectList) return;
    return windowScreen.webContents.executeJavaScript(`
    window.$ = document.querySelectorAll.bind(document);
    var projectList = ${projectList ? JSON.stringify(projectList) : false};
    console.log('token',projectList);
    var selectedProject = "";
    var sourceName="";

    function closeProjectModal(event){
        event.preventDefault();
        let openModel = document.getElementById('project')
        openModel.style.display = "none";
    }


    function selectProjectPopup(element){

        var modalElement = document.createElement('div')
            modalElement.innerHTML = '<div class="modal" id="project">'
        +'    <div class="header">'
        +'      <h3>Choose Project</h3>'
        +'    </div>'
        +'    <div class="content">'
        +'      <form>'
        +'        <label for="cars">Project Name</label>'
        +'        <select name="cars" id="selectProject">'
        +'        </select>'
        +'        <div class="btns">'
        +'          <button id="closeModal">Cancel</button>'
        +'          <button id="nextBtn" class="next">Next</button>'
        +'        </div>'
        +'      </form>'
        +'    </div>'
        +'    <div class="footer">'
        +'      <a href="https://discover360.app/audiences/projects">Create new project?</a>'
        +'    </div>'
        +'  </div>'

        document.body.appendChild(modalElement);

        let nextBtn = document.getElementById('nextBtn');
        if(nextBtn) nextBtn.addEventListener('click', function (event){
            event.preventDefault();
            if(document.getElementById('selectProject')){
                selectedProject = document.getElementById('selectProject').value;
                console.log(selectedProject);
            }
            closeProjectModal(event);
            openSourcePopup(event);
        });


        let closeModalBtn = document.getElementById('closeModal');
        if(closeModalBtn) closeModalBtn.addEventListener('click', function (event){
            event.preventDefault();
            closeProjectModal(event);
        });

        var selectProjectElement = document.getElementById("selectProject");
        for(var i = 0, l = projectList.length; i < l; i++){
            var option = projectList[i];
            selectProjectElement.add(new Option(projectList[i].name, projectList[i].id));
        }

      var sheet = document.createElement('style')
      sheet.innerHTML = ".main{    width: 100%;    height: 100vh;    text-align: center;  }    .main div{    width: 400px;    height: 400px;    margin:0 auto;    text-align: center;    }  .main div button{    top: 500px;    height: 30px;    margin: 0 auto;  }      .container{    display: none;    width: 100%;    height: 100vh;    position: fixed;    opacity: 0.9;    background: #222;    z-index: 40000;    top:0;    left: 0;    overflow: hidden;      animation-name: fadeIn_Container;    animation-duration: 1s;      }    .modal{    display:none;    top: 0;    min-width: 250px;    width: 80%;    height: auto;    margin: 0 auto;    position: fixed;    z-index: 40001;    background: #fff;    border-radius: 10px;    box-shadow: 0px 0px 10px #000;    margin-top: 30px;    margin-left: 10%;      animation-name: fadeIn_Modal;    animation-duration: 0.8s;    }    .header{   font-size: 1.875rem;  font-weight: 800;  line-height: 2.25rem;  width: 100%;    height: auto;    border-radius: 10px 10px 0px 0px;    position: relative;  }    .header h3{  font-size: 20px;      margin: 10px 30px;  }    .header a{    text-decoration: none;    float: right;    line-height: 70px;    margin-right: 20px;    color: #aaa;    position: absolute;    right: 0px;    top: 0px;    padding: 12px;  }    .content{    width: 100%;    height: auto;  }    form{    margin-top: 20px;  }    form label{    display: block;    margin-left: 12%;    margin-top: 10px;    font-family: sans-serif;    font-size: 1rem;  }    form input{    display: block;    width: 75%;    margin-left: 12%;    margin-top: 10px;    border-radius: 3px;    font-family: sans-serif;  }    #first_label{    padding-top: 30px;  }    #second_label{    padding-top: 25px;  }      .footer{    width: 100%;    height: auto;    border-radius: 0px 0px 10px 10px;    text-align: left;    }    .fotter button{    float: right;    margin-right: 10px;    margin-top: 18px;    text-decoration: none;   }    /****MEDIA QUERIES****/    @media screen and (min-width: 600px){      .modal{      width: 500px;      height: auto;      margin-left: calc(50vw - 250px);      margin-top: calc(50vh - 150px);    }        .header{      width: 100%;      height: auto;    }      .header a{      line-height: 0px;      margin-right: 10px;    }      .content{      width: 100%;      height: auto;    }      form label{      margin-left: 0px;      margin-top: 10px;      margin-bottom: 10px;    }      form input{      width: 75%;      margin-left: 0%;      margin-top: 10px;    }      #first_label{      padding-top: 0px;    }      #second_label{      padding-top: 0px;    }      .footer{      width: 100%;      height: auto;       }      .footer a{       color: #000;    text-align: left;        display: inline-block;      padding: 0px 30px 24px;    }    }    /*LARGE SCREEN*/  @media screen and (min-width: 1300px){    }    /****ANIMATIONS****/    @keyframes fadeIn_Modal {    from{      opacity: 0;    }    to{      opacity: 1;    }  }    @keyframes fadeIn_Container {    from{      opacity: 0;    }    to{      opacity: 0.9;    }    }    form{    margin: 20px 30px;  }    form select{        width: 100%;      height: 35px;  }    form .src-cls{    width: 100%;    height: 30px;    border: 1px solid #000;    font-size: 15px;  }    .btns{    display: inline-flex;      width: 100%;      margin-top: 17px;  }    form .btns button{    width: 50%;    height: 35px;    text-align: center;    border-radius: 3px;    border: 1px solid #000;  }  form .btns button:nth-child(2){    background: #000;    color: #fff;    margin-left: 5px;  }  form .btns button:nth-child(1){    background: #fff;    color: #000;    margin-right: 5px;      }";
      
      document.body.appendChild(sheet);
      let openModel = document.getElementById('project')
      openModel.style.display = "block";
    } 


    function closeSource(event){
        event.preventDefault();
        let sourceModal = document.getElementById('source')
        sourceModal.style.display = "none";
    }


    function openSourcePopup(event){
      event.preventDefault();
      var createSourceModal = document.createElement('div');
      createSourceModal.innerHTML = '<div class="modal" id="source">'
      + '  <div class="header">'
      + '    <h3>Create Source</h3>'
      + '  </div>'
      + '  <div class="content">'
      + '    <form>'
      + '      <label for="cars">Source Name</label>'
      + '      <input type="text" id="inputSource" class="src-cls" name="source" placeholder="facebook Post/ page/ X..."  required/>'
      + '      <div class="btns">'
      + '        <button  id="closeSource">Cancel</button>'
      + '        <button class="cancel" id="nextToSource">Next</button>'
      + '      </div>'
      + '    </form>'
      + '  </div>'
      + '  <div class="footer">'
      + '    <a href="">Create new project?</a>'
      + '  </div>'
      + '</div>';
      document.body.appendChild(createSourceModal);
      let sourceModal  = document.getElementById('source');
      console.log('sourceModal',sourceModal)
      sourceModal.style.display = "block";


    let nextToSource = document.getElementById('nextToSource');
    nextToSource.addEventListener('click', function (event){
        if(document.getElementById('inputSource')){
            sourceName = document.getElementById('inputSource').value;
        }
        console.log(selectedProject, sourceName)
        if(sourceName){
            startScraping();
            closeSource(event);
        }

    });


    let closeSourceBtn = document.getElementById('closeSource');
    closeSourceBtn.addEventListener('click', function (event){
        closeSource(event);
    });

    }




    let forceStopFetching = true;
    let next_fetch_request_body = null;
    let currCursor = "";
    let scrollWait = null;
    let countPerFetch = 10;

    let scrappedData = {
        groupName: "",
        totalMembers: 0,
        total_scrapped_member: 0,
        groupURL: "",
        members: [],
    };

    openProgressPopup = () => {
        var createProgressElement = document.createElement('div');
        createProgressElement.innerHTML = '<div class="modal" id="progress">'
         + '<div class="header">'
         + '  <h3 id="title">Processing...</h3>'
         + '<a id="hidePopup" class="cancel">x</a>'
         + '</div>'
         + '<div class="content">'
         + '  <form>'
         + '    <div>'
         + '      <span class="progress-status" id="progressTask" for="cars"></span>'
         + '      <span class="progress-percent" id="progressPercent" for="cars">0%</span>'
         + '    </div>'
         + '    <div class="meter">'
         + '      <span id="progressBar" style="width: 0%"></span>'
         + '    </div>'
         + '    <div class="btns">'
         + '      <button id="cancelProgress">Abort</button>'
         + '      <button class="cancel" id="viewProcessing" style="background: #6b6b6b;border: 1px solid #6b6b6b;">Processing...</button>'
         + '    </div>'
         + '  </form>'
         + '</div>'
         + '</div>'

         document.body.appendChild(createProgressElement);
         var progressSheet = document.createElement('style')
         progressSheet.innerHTML = ".main{   width: 100%;   height: 100vh;   text-align: center; } .main div{   width: 400px;   height: 400px;   margin:0 auto;   text-align: center; } .main div button{   top: 500px;   height: 30px;   margin: 0 auto; } .container{   display: none;   width: 100%;   height: 100vh;   position: fixed;   opacity: 0.9;   background: #222;   z-index: 40000;   top:0;   left: 0;   overflow: hidden;   animation-name: fadeIn_Container;   animation-duration: 1s;    } .modal{   display:none;   top: 0;   min-width: 250px;   width: 80%;   height: auto;   margin: 0 auto;   position: fixed;   z-index: 40001;   background: #fff;   border-radius: 10px;   box-shadow: 0px 0px 10px #000;   margin-top: 30px;   margin-left: 10%;   animation-name: fadeIn_Modal;   animation-duration: 0.8s; } .header{   width: 100%;   height: auto;   border-radius: 10px 10px 0px 0px;   position: relative; } .header h3{       margin: 10px 30px; } .header a{   text-decoration: none;   float: right;   line-height: 70px;   margin-right: 20px;   color: #aaa;   position: absolute;   right: 0px;   top: 0px;   padding: 12px; } .content{   width: 100%;   height: auto; } form{   margin-top: 20px; } form label{   display: block;   margin-left: 12%;   margin-top: 10px;   font-family: sans-serif;   font-size: 1rem; } form input{   display: block;   width: 75%;   margin-left: 12%;   margin-top: 10px;   border-radius: 3px;   font-family: sans-serif; } #first_label{   padding-top: 30px; } #second_label{   padding-top: 25px; } .footer{   width: 100%;   height: auto;   border-radius: 0px 0px 10px 10px;   text-align: left; } .fotter button{   float: right;   margin-right: 10px;   margin-top: 18px;   text-decoration: none;  } /****MEDIA QUERIES****/ @media screen and (min-width: 600px){   .modal{     width: 500px;     height: auto;     margin-left: calc(50vw - 250px);     margin-top: calc(50vh - 150px);   }   .header{     width: 100%;     height: auto;   }   .header a{     line-height: 0px;     margin-right: 10px;   }   .content{     width: 100%;     height: auto;   }   form label{     margin-left: 0px;     margin-top: 10px;     margin-bottom: 10px;   }   form input{     width: 75%;     margin-left: 0%;     margin-top: 10px;   }   #first_label{     padding-top: 0px;   }   #second_label{     padding-top: 0px;   }   .footer{     width: 100%;     height: auto;      }   .footer a{      color: #000;   text-align: left;       display: inline-block;     padding: 0px 30px 24px;   } } /*LARGE SCREEN*/ @media screen and (min-width: 1300px){ } /****ANIMATIONS****/ @keyframes fadeIn_Modal {   from{     opacity: 0;   }   to{     opacity: 1;   } } @keyframes fadeIn_Container {   from{     opacity: 0;   }   to{     opacity: 0.9;   } } form{   margin: 20px 30px; } form select{       width: 100%;     height: 35px; } form .src-cls{   width: 100%;   height: 30px;   border: 1px solid #000;   font-size: 15px; } .btns{   display: inline-flex;     width: 100%;     margin-top: 17px; } form .btns button{   width: 50%;   height: 35px;   text-align: center;   border-radius: 3px;   border: 1px solid #000; } form .btns button:nth-child(2){   background: #000;   color: #fff;   margin-left: 5px; } form .btns button:nth-child(1){   background: #fff;   color: #000;   margin-right: 5px;    } /*progress bar*/ .progress-status{   background: rgba(0, 0, 255, 0.21);     font-size: 14px;     display: inline-block;     padding: 1px 8px;     border: 1px solid rgba(7, 19, 171, 1);     border-radius: 16px;     color: #0713ab; } .progress-percent{   text-align: right;   font-size: 14px;   display: inline-block;   color: #0713ab;   float: right; } .meter {    height: 10px;   position: relative;   background: #cac8fd;   border-radius: 5px;   padding: 0px;   box-shadow: inset 0 -1px 1px rgba(255, 255, 255, 0.3);       margin-top: 9px; } .meter > span {   display: block;   height: 100%;   border-top-right-radius: 8px;   border-bottom-right-radius: 8px;   border-top-left-radius: 20px;   border-bottom-left-radius: 20px;   background-color: rgb(31 80 171);   background-image: linear-gradient(     center bottom,     rgb(43,194,83) 37%,     rgb(84,240,84) 69%   );   box-shadow:      inset 0 2px 9px  rgba(255,255,255,0.3),     inset 0 -2px 6px rgba(0,0,0,0.4);   position: relative;   overflow: hidden; }";
         
         document.body.appendChild(progressSheet);
         let openProgressModel = document.getElementById('progress')
         openProgressModel.style.display = "block";
         document.getElementById('cancelProgress').style.cursor = "pointer";
         document.getElementById('hidePopup').addEventListener('click',function(event){
            event.preventDefault();
            openProgressModel.style.display = 'none';
            window.location.reload();
        })   

         document.getElementById('cancelProgress').addEventListener('click',function(event){
             event.preventDefault();
             stopExtrator();
         })
    }



    const startScraping = () => {
        // Don't stop extractor until we get last member or user stops extractor
        forceStopFetching = false;
        openProgressPopup();
        
        // Initialise the scraped data object
        scrappedData = {
            groupName: "",
            totalMembers: 0,
            groupURL: "",
            members: [],
        };

        // We don't have request header value so far
        next_fetch_request_body = null;

        // Scrape group essential information from the webpage
        // Name, Total Members and Group URL
        if($('span.h6olsfn3') && $('span.h6olsfn3').length)
            scrappedData.groupName = $('span.h6olsfn3')[0].innerText;
        

        let memberElement = $('div.sbcfpzgs>div>div>div>div:nth-child(1)>div>div>div>div>div:nth-child(1)>h2>span>span>span>strong');
        scrappedData.totalMembers = memberElement && memberElement.length ? memberElement[0].innerText : '';
        let totalMember = scrappedData.totalMembers.split(" ")
        totalMember = totalMember.pop().replace(',','');
        scrappedData.totalMembers = totalMember;
        console.log('scrappedData->',scrappedData.totalMembers)
        scrappedData.groupURL = document.URL.split("/").slice(0, 5).join("/");


        let progressTaskElement = document.getElementById('progressTask');
        progressTaskElement.innerText = "TASK IN PROGRESS: 0 of "+scrappedData.totalMembers;
        
        // If Total members is less than 999, Start fetchin with lesser members per request
        scrappedData.totalMembers < 999
            ? (countPerFetch =
                countPerFetch < scrappedData.totalMembers
                    ? countPerFetch
                    : scrappedData.totalMembers)
            : countPerFetch;

        // Scroll to bottom so that we can get request headers being sent from browser to the FB server
        scrollToBottomForRequestHeaders();
    };


    const scrollToBottomForRequestHeaders = () => {
        window.scrollTo(0, document.body.scrollHeight);
        
        scrollWait = setTimeout(() => {
            // If we get request headers start fetching
            console.log('frce-->',forceStopFetching)
            if(forceStopFetching) return;
            if(+scrappedData.totalMembers > scrappedData.members.length){
                fetchNext();
                clearInterval(scrollWait);
                return;
            }else{
                console.log("stopExtrator");
                clearInterval(scrollWait);
                // Otherwise stop the extractor
                stopExtrator();
            }
        }, 1000);
    };



    // Fetch next bunch of members
    var fetchNext = () => {
        let formDataBody = variable;
        if(formDataBody) formDataBody = JSON.parse(formDataBody);
        let keysArray = Object.keys(formDataBody)
        keysArray.forEach((key)=>{
            formDataBody[key] = [decodeURIComponent(formDataBody[key])]
        })
        let __variables = formDataBody.variables;
        __variables = JSON.parse(__variables);
        __variables.count = countPerFetch;
        __variables.cursor = currCursor;
        formDataBody.variables = JSON.stringify(__variables);
        next_fetch_request_body = formDataBody;
        const data = new URLSearchParams();
        for (const key of Object.keys(next_fetch_request_body)) {
            data.append(key, [next_fetch_request_body[key]]);
        }
        let bodyData = {
            headers: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9",
                "cache-control": "no-cache",
                "content-type": "application/x-www-form-urlencoded",
                pragma: "no-cache",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            referrer: scrappedData.groupURL + '/members',
            referrerPolicy: "strict-origin-when-cross-origin",
            body: data,
            method: "POST",
            mode: "cors",
            credentials: "include",
        }
        fetch("https://www.facebook.com/api/graphql/", bodyData)
            .then((response) => {
                if (!response.ok) {
                    countPerFetch -= 100;
                    countPerFetch < 10 ? (countPerFetch = 10) : countPerFetch;
                    return;
                }
                // Else extract members details from the request response
                return response.text();
            })
            .then((text) => {
                // If fetching is stopped don't scrap data and proceed further
                let graphqlResult = text ? JSON.parse(text) : '';
                graphqlResult = graphqlResult.data.node;
                
                if(graphqlResult && graphqlResult.new_members && graphqlResult.new_members.edges){
                    graphqlResult.new_members.edges.forEach((member)=>{
                        let _work = member && member.node && member.node.bio_text ? member.node.bio_text.text.split(" at "): '';
                        scrappedData.members.push({
                            designation : _work.length ? _work[0] : "",
                            company : _work.length ? _work.slice(1).join(" ") : "",
                            name : member.node.name,
                            photoURL : member.node.profile_picture.uri,
                            profile_url : member.node.url
                        })
                    })
                    currCursor = graphqlResult && graphqlResult.new_members && graphqlResult.new_members.page_info 
                    ? graphqlResult.new_members.page_info.end_cursor : ""; 
                    console.log(scrappedData.members);

                    if(graphqlResult.new_members && graphqlResult.new_members.page_info && !graphqlResult.new_members.page_info.has_next_page){
                        progressBarUpdate();
                        stopExtrator();
                    }else if(!forceStopFetching){ 
                        console.log('fetch--->');
                        progressBarUpdate();
                        fetchNext();
                    }         
                    
                }

                if(graphqlResult && graphqlResult.new_forum_members && graphqlResult.new_forum_members.edges){
                    graphqlResult.new_forum_members.edges.forEach((member)=>{
                        let _work = member && member.node && member.node.bio_text ? member.node.bio_text.text.split(" at "): '';
                        scrappedData.members.push({
                            designation : _work.length ? _work[0] : "",
                            company : _work.length ? _work.slice(1).join(" ") : "",
                            name : member.node.name,
                            photoURL : member.node.profile_picture.uri,
                            profile_url : member.node.url
                        })
                    }) 
                    currCursor = graphqlResult && graphqlResult.new_forum_members && graphqlResult.new_forum_members.page_info 
                    ? graphqlResult.new_forum_members.page_info.end_cursor : ""; 
                    console.log(scrappedData.members);

                    if(graphqlResult.new_forum_members && graphqlResult.new_forum_members.page_info && !graphqlResult.new_forum_members.page_info.has_next_page){
                        progressBarUpdate();
                        stopExtrator();
                    }else{ 
                        console.log('fetch--->Tests');
                        progressBarUpdate();
                        fetchNext();
                    }    
                }
                return;
            })
            .catch((err) => {
                console.log('err-->',err);
                fetchNext();
                return;
            });
    };

    progressBarUpdate = () => {
        if(scrappedData && scrappedData.members){
            let scrappedMembersCount = scrappedData.members.length;
            let totalMembersCount = +scrappedData.totalMembers;
            let progressTaskElement = document.getElementById('progressTask');
            progressTaskElement.innerText = "TASK IN PROGRESS: "+ scrappedMembersCount +" of "+totalMembersCount;
            let percentage = (scrappedMembersCount / totalMembersCount) * 100;
            console.log('per',percentage);
            percentage = percentage < 90 ? Math.round(percentage) + '%' : 100 + '%';
            let percentText = document.getElementById('progressPercent');
            percentText.innerText = percentage;
            let progressBarElement = document.getElementById('progressBar');
            progressBarElement.style.width = percentage;             

        }
    }

            
        
    const stopExtrator = () => {
        forceStopFetching = true;
        scrappedData.total_scrapped_member = scrappedData.members.length;
        var total_members = +scrappedData.totalMembers;
        var dataToBeScrapped = scrappedData;
        delete dataToBeScrapped.totalMembers;
        console.log('stopExtractor-->',JSON.stringify({
            "project_id": selectedProject,
            "name": sourceName,
            "file": dataToBeScrapped,
            "total_members": total_members       
        }))
        document.getElementById('title').innerText = "Done";
        let progressTaskElement = document.getElementById('progressTask');
        progressTaskElement.innerText = "TASK IS COMPLETED: "+ scrappedData.total_scrapped_member + " of " + total_members;
        progressTaskElement.style.background = "#DEE9FF";
        let viewProcessing = document.getElementById('viewProcessing');
        document.getElementById('cancelProgress').style.display = "none";
        viewProcessing.innerText = "View Audience";
        viewProcessing.style.background = "";
        viewProcessing.style.cursor = "pointer";
        viewProcessing.style['margin-left'] = "25%";
        viewProcessing.addEventListener('click', function(event){
            event.preventDefault();
            window.location.href = "https://discover360.app/audiences/projects/sources/" + selectedProject;
        })
        clearInterval(scrollWait);
    }

    Promise.resolve();
    `)
}


function addIconsScript(windowScreen) {
    windowScreen.webContents.executeJavaScript(`
    window.$ = document.querySelectorAll.bind(document)
    document.addEventListener("mousemove", function () {
        if(window.location.href.includes('facebook.com/groups') && !document.getElementById('hammer') ){
            // let groupName1 = $('div.d6urw2fd>div:nth-child(1)>div:nth-child(1)>div:nth-child(2)>div>div>div>div');
            // let groupName2 = $('div.ka73uehy>div:nth-child(2)>div>div>div>div:nth-child(1)>div:nth-child(2)>div>div>div>div')
    
            if($('span.h6olsfn3') && $('span.h6olsfn3').length){

                var groupPostExtractor = document.createElement("img");
                groupPostExtractor.setAttribute('src','https://img.icons8.com/emoji/452/hammer-and-pick.png');
                groupPostExtractor.setAttribute('width','32px');
                groupPostExtractor.setAttribute('id','hammer');
                groupPostExtractor.setAttribute('height','32px');
                groupPostExtractor.style['margin-bottom'] = '-6px';
                groupPostExtractor.style['margin-left'] = '5px';
                groupPostExtractor.style['cursor'] = 'pointer';

                var groupMemberExtractor = document.createElement("img");
                groupMemberExtractor.setAttribute('src','https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/e-mail_1f4e7.png');
                groupMemberExtractor.setAttribute('width','32px');
                groupMemberExtractor.setAttribute('id','memberExtractor');
                groupMemberExtractor.setAttribute('height','32px');
                groupMemberExtractor.style['margin-bottom'] = '-6px';
                groupMemberExtractor.style['margin-left'] = '10px';
                groupMemberExtractor.style['cursor'] = 'pointer';

                $('span.h6olsfn3')[0].append(groupPostExtractor);
                $('span.h6olsfn3')[0].append(groupMemberExtractor);
    
                const element = document.getElementById('memberExtractor');
                const postElement = document.getElementById('hammer');

            if (element && element.getAttribute('listener') !== 'true') {
                 element.addEventListener('click', function (e) {
                    element.setAttribute('listener', 'true');
                    let memberButton = Array.prototype.slice.call(document.getElementsByTagName('a')).filter(el => el.textContent.includes('Members'));
                    if(memberButton && memberButton.length && memberButton[1])
                        memberButton[1].click();
                });
                postElement.addEventListener('click', function(event){
                    var url = "https://mbasic.facebook.com" + window.location.href.split(window.location.hostname)[1];
                    window.location.assign(url);
                })
            }    
            }
            
        }


        let memberElement = $('div.sbcfpzgs>div>div>div>div:nth-child(1)>div>div>div>div>div:nth-child(1)>h2>span>span>span>strong');
        if(memberElement && memberElement.length && !document.getElementById('memberExtractorSm')){
            var memberPostExtractorIcon = document.createElement("img");
            memberPostExtractorIcon.setAttribute('src','https://img.icons8.com/emoji/452/hammer-and-pick.png');
            memberPostExtractorIcon.setAttribute('width','25px');
            memberPostExtractorIcon.setAttribute('id','hammerSm');
            memberPostExtractorIcon.setAttribute('height','25px');
            memberPostExtractorIcon.style['margin-bottom'] = '-6px';
            memberPostExtractorIcon.style['margin-left'] = '5px';
            memberPostExtractorIcon.style['cursor'] = 'pointer';

            var memberExtractorIcon = document.createElement("img");
            memberExtractorIcon.setAttribute('src','https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/120/apple/285/e-mail_1f4e7.png');
            memberExtractorIcon.setAttribute('width','25px');
            memberExtractorIcon.setAttribute('id','memberExtractorSm');
            memberExtractorIcon.setAttribute('height','25px');
            memberExtractorIcon.style['margin-bottom'] = '-6px';
            memberExtractorIcon.style['margin-left'] = '10px';
            memberExtractorIcon.style['cursor'] = 'pointer';

            memberElement[0].append(memberPostExtractorIcon);
            memberElement[0].append(memberExtractorIcon);
            const smallMemberExtractor = document.getElementById('memberExtractorSm');

            if (smallMemberExtractor && smallMemberExtractor.getAttribute('listener') !== 'true') {
                 smallMemberExtractor.addEventListener('click', function (e) {
                    smallMemberExtractor.setAttribute('listener', 'true');
                    selectProjectPopup(e);                             
                });
            }
            const mbasicIconElement = document.getElementById('hammerSm');  
            mbasicIconElement.addEventListener('click', function(event){
                var url = "https://mbasic.facebook.com" + window.location.href.split(window.location.hostname)[1];
                window.location.assign(url);
            })
        }
    })
    `);
}

function openPopupTokenIsNotSaved(windowScreen) {
    windowScreen.webContents.executeJavaScript(`
    var tokenEmptyModal = document.createElement('div')
    tokenEmptyModal.innerHTML = '<div class="modal" id="emptyModal">'
        +'    <div class="header">'
        +'      <h3>Token not saved</h3>'
        +'    </div>'
        +'    <div class="content">'
        +'      <form>'
        +'        <label for="cars">Need to save token from setting!</label>'
        +'        <div class="btns">'
        +'          <button id="closeModal">Cancel</button>'
        +'          <button id="getToken" class="next">Get Token</button>'
        +'        </div>'
        +'      </form>'
        +'    </div>'
        +'    <div class="footer">'
        +'      <a href="https://discover360.app/user/api-tokens">Generate new api token?</a>'
        +'    </div>'
        +'  </div>'

        var sheet = document.createElement('style')
        sheet.innerHTML = ".main{    width: 100%;    height: 100vh;    text-align: center;  }    .main div{    width: 400px;    height: 400px;    margin:0 auto;    text-align: center;    }  .main div button{    top: 500px;    height: 30px;    margin: 0 auto;  }      .container{    display: none;    width: 100%;    height: 100vh;    position: fixed;    opacity: 0.9;    background: #222;    z-index: 40000;    top:0;    left: 0;    overflow: hidden;      animation-name: fadeIn_Container;    animation-duration: 1s;      }    .modal{    display:none;    top: 0;    min-width: 250px;    width: 80%;    height: auto;    margin: 0 auto;    position: fixed;    z-index: 40001;    background: #fff;    border-radius: 10px;    box-shadow: 0px 0px 10px #000;    margin-top: 30px;    margin-left: 10%;      animation-name: fadeIn_Modal;    animation-duration: 0.8s;    }    .header{   font-size: 1.875rem;  font-weight: 800;  line-height: 2.25rem;  width: 100%;    height: auto;    border-radius: 10px 10px 0px 0px;    position: relative;  }    .header h3{  font-size: 20px;      margin: 10px 30px;  }    .header a{    text-decoration: none;    float: right;    line-height: 70px;    margin-right: 20px;    color: #aaa;    position: absolute;    right: 0px;    top: 0px;    padding: 12px;  }    .content{    width: 100%;    height: auto;  }    form{    margin-top: 20px;  }    form label{    display: block;    margin-left: 12%;    margin-top: 10px;    font-family: sans-serif;    font-size: 1rem;  }    form input{    display: block;    width: 75%;    margin-left: 12%;    margin-top: 10px;    border-radius: 3px;    font-family: sans-serif;  }    #first_label{    padding-top: 30px;  }    #second_label{    padding-top: 25px;  }      .footer{    width: 100%;    height: auto;    border-radius: 0px 0px 10px 10px;    text-align: left;    }    .fotter button{    float: right;    margin-right: 10px;    margin-top: 18px;    text-decoration: none;   }    /****MEDIA QUERIES****/    @media screen and (min-width: 600px){      .modal{      width: 500px;      height: auto;      margin-left: calc(50vw - 250px);      margin-top: calc(50vh - 150px);    }        .header{      width: 100%;      height: auto;    }      .header a{      line-height: 0px;      margin-right: 10px;    }      .content{      width: 100%;      height: auto;    }      form label{      margin-left: 0px;      margin-top: 10px;      margin-bottom: 10px;    }      form input{      width: 75%;      margin-left: 0%;      margin-top: 10px;    }      #first_label{      padding-top: 0px;    }      #second_label{      padding-top: 0px;    }      .footer{      width: 100%;      height: auto;       }      .footer a{       color: #000;    text-align: left;        display: inline-block;      padding: 0px 30px 24px;    }    }    /*LARGE SCREEN*/  @media screen and (min-width: 1300px){    }    /****ANIMATIONS****/    @keyframes fadeIn_Modal {    from{      opacity: 0;    }    to{      opacity: 1;    }  }    @keyframes fadeIn_Container {    from{      opacity: 0;    }    to{      opacity: 0.9;    }    }    form{    margin: 20px 30px;  }    form select{        width: 100%;      height: 35px;  }    form .src-cls{    width: 100%;    height: 30px;    border: 1px solid #000;    font-size: 15px;  }    .btns{    display: inline-flex;      width: 100%;      margin-top: 17px;  }    form .btns button{    width: 50%;    height: 35px;    text-align: center;    border-radius: 3px;    border: 1px solid #000;  }  form .btns button:nth-child(2){    background: #000;    color: #fff;    margin-left: 5px;  }  form .btns button:nth-child(1){    background: #fff;    color: #000;    margin-right: 5px;      }";
        
        document.body.appendChild(sheet);

        document.body.appendChild(tokenEmptyModal);
        document.getElementById('emptyModal').style.display = 'block';

        let getTokenPage = document.getElementById('getToken');
        getTokenPage.addEventListener('click',function(event){
            event.preventDefault();
            window.location.href = 'http://localhost:3000/setting';
        })
        
        let closeModal = document.getElementById('closeModal');
        closeModal.addEventListener('click',function(){ 
            event.preventDefault();
            document.getElementById('emptyModal').style.display="none";
        })
        `)
}


function getFacebookMembersDetail(windowScreen, session, store) {
    setTimeout(async () => {
        let token = store.get('token');
        if (token) facebookGroupPostPageLoaded(windowScreen, token);
        else openPopupTokenIsNotSaved(windowScreen)
        const filter = {
            urls: [
                "https://www.facebook.com/api/graphql/",
                "https://www.facebook.com/api/graphql?member=true",
                "https://web.facebook.com/api/graphql/",
                "https://mbasic.facebook.com/api/graphql/",
                "https://m.facebook.com/api/graphql/",
                "https://mobile.facebook.com/api/graphql/",
            ]
        }
        var requestBody = {};

        await session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            if (details.uploadData) {
                const buffer = Array.from(details.uploadData)[0].bytes;
                let keyValueArray = buffer.toString().split("&");
                keyValueArray.forEach((keyValue) => {
                    let key = keyValue.split('=')[0];
                    let value = keyValue.split('=')[1];
                    requestBody[key] = value;
                })

                if (
                    (requestBody && requestBody.fb_api_req_friendly_name ==
                        "GroupsCometMembersPageNewMembersSectionRefetchQuery") ||
                    requestBody.fb_api_req_friendly_name ==
                    "GroupsCometMembersPageNewForumMembersSectionRefetchQuery"
                ) {
                    windowScreen.webContents.executeJavaScript(`var variable = '${JSON.stringify(requestBody)}';`);
                }

            }
            callback({ requestHeaders: details.requestHeaders })
        })
    }, 600)


}