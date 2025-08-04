

var adslink = 'http://ads.sismen.com/ads/applike.php?c=orthodox&d=ios';
var feedback = 'mailto:info@sismen.com?subject=Comment on Fidel App';

function loadScript (file, callback) {
    callback = callback ||
    function () {};
    var filenode;
    var jsfile_extension = /(.js)$/i;
    var jetfile_extension = /(.jet)$/i;
    var cssfile_extension = /(.css)$/i;

    if (jsfile_extension.test(file)||jetfile_extension.test(file)) {
        filenode = document.createElement('script');
        filenode.src = file;
        // IE
        filenode.onreadystatechange = function () {
            if (filenode.readyState === 'loaded' || filenode.readyState === 'complete') {
                filenode.onreadystatechange = null;
                callback();
            }
        };
        // others
        filenode.onload = function () {
            callback();
        };
        document.head.appendChild(filenode);
    } else if (cssfile_extension.test(file)) {
        filenode = document.createElement('link');
        filenode.rel = 'stylesheet';
        filenode.type = 'text/css';
        filenode.href = file;
        document.head.appendChild(filenode);
        callback();
    } else {
        console.log("Unknown file type to load.")
    }
}


$(function(){ 
	
	
/* Chrome 
  loadScript("commons/scripts/chrome.css", function(){
     		init();
	 });
});
*/

/* Android */
 loadScript("scripts/mobile.css", function(){
  loadScript("scripts/mezmur.js", function(){
  //loadScript("cordova.js", function(){
 		//document.addEventListener("deviceready", init, false);

			init();
	//  });
	});	
  });
});

function init(){

 
 $("#back").click(function(){javascript:history.back(-1);});	
 $("#refresh").click(function(){location.reload();});
 $("#menu").click(function(){window.location.href  = 'menu.htm';});
 $("#titleText").html("መዝሙር");
 
var pagePath = window.location.pathname;


//index.htm events
if(pagePath.indexOf("splash.htm") >= 0 ){ 
  }

 //index.htm events
if(pagePath.indexOf("index.htm") >= 0 ){
        
        //localStorage.clear();
        if(localStorage.getItem('User_Name')!=null)
            $("#nikename").val(localStorage['User_Name']);
        if(localStorage.getItem('User_Email')!=null)
            $("#email").val(localStorage['User_Email']);
        $("#sound").attr('checked',localStorage['Mezmur_Sound']);
        
        $("#btnnext").click(function(){ saveAndRedirect(); });
        $("#ads").attr('src',adslink);
        
    }
    
 if(pagePath.indexOf("mezmur.htm") >= 0 ){ 
   initMezmur();
 }
 if(pagePath.indexOf("main.htm") >= 0 ){ 
     initMain();
	 $('#backPage').click(function(){backPage();  });
 	 $('#nextPage').click(function(){nextPage();  });
 }
 if(pagePath.indexOf("menu.htm") >= 0 ){ 
     initCategory();
 }
 
 if(pagePath.indexOf("search.htm") >= 0 ){ 	
   loadScript("scripts/at.js", function(){

   $("#searchText").keypress(function(){ return AmharicPhoneticKeyPress(event,this);});

   $("#search").click(function(){ fetchByText();});
   
   });
   
 }

}

function nextPage(){

	var mezmurid = parseInt(localStorage.getItem('mezmurid'));
	if(mezmurid < 1025){
	   mezmurid++;
	   localStorage['mezmurid'] = mezmurid;
    }   
	
	refreshMezmur(mezmurid);
}
function backPage(){

	var mezmurid = parseInt(localStorage.getItem('mezmurid'));
	if(mezmurid>1){
		mezmurid--;	
	  localStorage['mezmurid'] = mezmurid;
    }
	
	refreshMezmur(mezmurid);
}

function refreshMezmur(mezmurid){
initDatabase(prePopulate);
selectMezmurData(mezmurid, initMain);
//initMain();
}
function initMain(){
     
	var mezmurid = parseInt(localStorage.getItem('mezmurid'));
	var mezmurtitle = localStorage.getItem("mezmurtitle");
	var imgsrc = 'images/mezmur/' + mezmurid ;
  	$('#mezmurtitle').html(mezmurid + " : " + mezmurtitle); 
  	
    loadMezmur($('#mezmurimage'), imgsrc +'.png', [".PNG",".jpg"]);
    $('#mezmurimage').error(function(){
    loadMezmur($('#mezmurimage_a'), imgsrc +'_a.png', [".PNG",".jpg"]);
    loadMezmur($('#mezmurimage_b'), imgsrc +'_b.png', [".PNG",".jpg"]);
    loadMezmur($('#mezmurimage_c'), imgsrc +'_c.png', [".PNG",".jpg"]);
    loadMezmur($('#mezmurimage_d'), imgsrc +'_d.png', [".PNG",".jpg"]);
    });


}


function loadMezmur(img, src, ext){
$(img).attr('src', src); 
$(img).load(function() {
    $(this).show();
});
$(img).error(function(){
         if(ext.length == 0)
    		$(this).hide();
    	  else{
    	    src = src.substring(0, src.length - 4 ) + ext.pop();
    	    loadMezmur(img, src, ext);
    	  }
});
}
function initMezmur(){
    initDatabase(prePopulate);
	var categoryid = window.localStorage.getItem('categoryid');
	selectMezmur(categoryid);
}
function initCategory(){
    initDatabase(prePopulate);
	selectCategory();
}

function fetchByText(){
  initDatabase(prePopulate);	
  var searchText = document.getElementById('searchText').value;
   if(searchText !=""){
   //var searchCode = Utf8.amEncode(searchText);
   searchMezmur('%' + searchText + '%');
   }
}

function saveAndRedirect()
{   /*
    var name = document.getElementById("nikename").value;
    var email = document.getElementById("email").value;
    
    localStorage['User_Name'] = name;
    localStorage['User_Email'] = email;
    
    saveUser(name,email,'mezmur');
    */
    window.location.href  = 'menu.htm';
}

function saveUser(name, email, app){
    
    if(email != ""){
        var saveUser = 'http://ads.sismen.com/ads/appUsers.php?name=' + name + '&email=' + email + '&app=' + app
        
        $.getJSON(saveUser, function(data) {
                  
                  if(data.result == "success")
                    return true;
                  });
    }
    return false;
}