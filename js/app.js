var gbldata;
const state = { year:'', land:'', launch:'' };

window.onload = function(){
    state.year = '';
    state.land = '';
    state.launch = '';
    
    loadCardDetails(false);
    
    if(sessionStorage.getItem('localUrl') == null || sessionStorage.getItem('localUrl') == undefined){
        sessionStorage.setItem('localUrl',window.location.href);
        window.history.pushState(state, '', window.location.href);
    } 
}

window.onpopstate = (event) => {
    console.log(event.state);

    if(event.state) {
        if(event.state.year || event.state.land || event.state.launch ){
            state.year = event.state.year;
            state.land = event.state.land;
            state.launch = event.state.launch;
            checkFilterCombination(false);
        } 
    }else {
            loadCardDetails(true);
    }
    
};

var loadCardDetails = function(reload) {
    $('.lds-spinner').css('display','inline-block');
    $('.cards-container').css('display','none');

    $.ajax({
        type: "GET",
        url: 'https://api.spaceXdata.com/v3/launches?limit=100',
        dataType: "json",
        success: function (data) {
            if (data != null || data != undefined) {
                gbldata = data;
                renderCardDetails(data,reload);
                trackRadioSelection();                
            } else {
                console.log('There was issue in fetching details');
            }

        },
        error: function (error) {
            $('.lds-spinner').css('display','none');
            $('.cards-container').css('display','flex');
            console.log(error);
        }
    });
}


var renderCardDetails = function (data,renderCount) {
    console.log(data);

    let htm;
    if(renderCount){
        htm = '';
    } else{
        htm = $('.cards-container').html();
    }

    if(data == null || data.length == 0){

        $('.lds-spinner').css('display','none');
        $('.cards-container').css('display','flex');

        let noResultsDiv = '<div class="noResults">No Matching Results for Selected filter</div>';
        htm = $('.cards-container').html(noResultsDiv);

    } else{

        let landCheck;
        if($('input[type="radio"][name=success-land-btn]:checked').length){
            landCheck = $('input[type="radio"][name=success-land-btn]:checked').val().toLowerCase();
        } else{
            landCheck = false;
        }
        
        data.forEach(element => {
            //making list of mission Id's and storing in list variable
            let list = '';
            let missionIds = [];
            missionIds = element.mission_id;
            if(missionIds !== null){
                list = '<ul class="missionidlist">';
               for( i= 0; i < missionIds.length ; i++){
                    list += '<li class="missionidlistItem">'+missionIds[i]+'</li>';
               }
               list += '</ul>'
            } else{
                list = '';
            }
    
            //Creating Cards for display
            let card =  
            `<div class="card-tile">
            <div class="card-img">
                <img class="mission-spacecraft-img"
                srcset="${element.links.mission_patch_small} 480w,
                        ${element.links.mission_patch} 800w"
                sizes="(max-width: 1023px) 480px,
                    800px"
                src="${element.links.mission_patch}" alt="Mission_image">
            </div>
            <div class="card-heading">
                <span class="mission-name mission-id">${element.mission_name}</span>
                <span class="flight-number mission-id"># ${element.flight_number}</span>
            </div>
            <div class="card-details">
                <div class="mission-ids card-sec">
                    <span class="mission-label">Mission Ids:</span>
                    
                    <span class="mission-details">`+list+`</span>
                </div>
                <div class="launch-year-card card-sec">
                    <span class="mission-label">Launch Year:</span>
                    <span class="mission-details">${element.launch_year}</span>
                </div>
                <div class="success-launch-card card-sec">
                    <span class="mission-label">Successful Launch:</span>
                    <span class="mission-details">${element.launch_success}</span>
                </div>
                <div class="success-landing-card card-sec">
                    <span class="mission-label">Successful Landings:</span>
                    <span class="mission-details">`+ landCheck +`</span>
                </div>
            </div>
            </div>`

            htm += card;   
        });
        $('.lds-spinner').css('display','none');
        $('.cards-container').css('display','flex');
        $('.cards-container').html(htm);
    }  
}

var collectFilterData = function() {
    let launchYr = undefined;
    let successfulLaunch = undefined;
    let successfulLand = undefined;

    if($('input[name=launch-yr-btn]:checked').length > 0){
        launchYr = $('input[name=launch-yr-btn]:checked').val().toLowerCase();
        console.log('yes selected' + launchYr);
    }
    if($('input[name=success-launch-btn]:checked').length > 0){
        successfulLaunch = $('input[name=success-launch-btn]:checked').val().toLowerCase();
        console.log('yes selected' + successfulLaunch);
    }
    if($('input[name=success-land-btn]:checked').length > 0){
        successfulLand = $('input[name=success-land-btn]:checked').val().toLowerCase();
        console.log('yes selected' + successfulLand);
    } 
    
    state.land = successfulLand;
    state.launch = successfulLaunch;
    state.year = launchYr;

    checkFilterCombination();
}

var checkFilterCombination = function(setState = true){

    let dynamicUrl;
    let dynamicWindowUrl;
    let land = state.land ;
    let launch = state.launch;
    let year = state.year;
    let callApiToken = false;
    let checkFilterscomb = '';

    $('.lds-spinner').css('display','inline-block');
    $('.cards-container').css('display','none');

    if(year && launch && land) {
        dynamicUrl = 'https://api.spacexdata.com/v3/launches?limit=100&launch_success='+launch+'&land_success='+land+'&launch_year='+year;
        callApiToken = true;
    }
    else if(launch && land) {
        dynamicUrl = 'https://api.spaceXdata.com/v3/launches?limit=100&launch_success='+launch+'&land_success='+land;
        callApiToken = true;
    } 
    else if(year && land){
        dynamicUrl = '%&land_success='+land+'&launch_year='+ year;
        callApiToken = false;
        checkFilterscomb = 'yland';
    } 
    else if(year && launch){
        dynamicUrl = '%&launch_success='+launch+'&launch_year='+ year;
        callApiToken = false;
        checkFilterscomb = 'ylaunch';
    } 
    else if(launch) {
        dynamicUrl = 'https://api.spaceXdata.com/v3/launches?limit=100&launch_success='+launch;
        callApiToken = true;
    } 
    else if(year){
        dynamicUrl = '%&launch_year='+ year;
        callApiToken = false;
        checkFilterscomb = 'yr';
    } 
    else if(land) {
        dynamicUrl = '%&land_success='+land;
        callApiToken = false;
        checkFilterscomb = 'land';
    }
    
        //Creating urls for tab propagation
        if(dynamicUrl.indexOf('&') != 0){
            let slicedUrl = dynamicUrl.slice(dynamicUrl.indexOf('&'));
            dynamicWindowUrl = sessionStorage.getItem('localUrl') + '%20' + slicedUrl;
        } else {
            dynamicWindowUrl = sessionStorage.getItem('localUrl');
        }

        if(setState){
            window.history.pushState(state, '', dynamicWindowUrl);
        }
        
        callApiForSelectedFilter(dynamicUrl,callApiToken,checkFilterscomb);
}


var callApiForSelectedFilter = function(dynamicUrl,callApiToken,checkFilterscomb){

    let land = state.land ;
    let launch = state.launch;
    let year = state.year;

    if(callApiToken === true){
        $.ajax({
            type: "GET",
            url: dynamicUrl,
            dataType: "json",
            success: function (data) {
                if (data != null || data != undefined) {
                    let rerender = true;
                    renderCardDetails(data,rerender);
                    trackRadioSelection();                
                } else {
                    console.log('There was issue in fetching details');
                }
    
            },
            error: function (error) {
                console.log(error);
                $('.lds-spinner').css('display','none');
                $('.cards-container').css('display','flex');
            }
        });
    } else{

        if (gbldata != null || gbldata != undefined) {
            data = gbldata;
            let filteredResult = [];
            let filterOnYear = [];
            
            if(checkFilterscomb == 'yland'){
                filterOnYear = data.filter(el => el.launch_year === year);
                if(land === 'true'){
                    filteredResult = filterOnYear.filter(checkForTrueFilter);
                } else {
                    filteredResult = filterOnYear.filter(checkForFalseFilter);
                }
            }

            else if(checkFilterscomb == 'ylaunch'){
                filterOnYear = data.filter(el => (el.launch_year).toString() === year);
                filteredResult = filterOnYear.filter(el => (el.launch_success).toString() === launch);
            }

            else if(checkFilterscomb == 'yr'){
                filteredResult = data.filter(el => (el.launch_year).toString() === year);
            } 
            
            else if(checkFilterscomb == 'land'){
                if(land === 'true'){
                    filteredResult = data.filter(checkForTrueFilter);
                } else {
                    filteredResult = data.filter(checkForFalseFilter);
                }
            }

            console.log('filteredResult',filteredResult);
            renderCardDetails(filteredResult,true);
        }

    }
        $('.lds-spinner').css('display','none');
        $('.cards-container').css('display','flex');
}

    

var checkForTrueFilter = function(el){
    let checkedAll = false;
       
    if(el.rocket.first_stage.cores.length){
        checkedAll = el.rocket.first_stage.cores.every((elem) => elem.land_success === true);
    }
    
    if(checkedAll){
        return true;
    }
}

var checkForFalseFilter = function(el){
    let checkedAll = false;
       
    if(el.rocket.first_stage.cores.length){
        checkedAll = el.rocket.first_stage.cores.every((elem) => elem.land_success === false);
    }
    
    if(checkedAll){
        return true;
    }
}

var trackRadioSelection = function(){
    
    //Disable land filters if Launch is false
    $('input[name=success-launch-btn][value=False]').click(function(){
        $('input[type="radio"][name=success-land-btn]').attr('disabled',true);
        $('input[name=success-land-btn]').prop("checked", false);
        $('label[for=True-land],label[for=False-land]').css("opacity", 0.5);

    });

    //Unable land filters if Launch is false
    $('input[name=success-launch-btn][value=True]').click(function(){
        $('input[type="radio"][name=success-land-btn]').attr('disabled',false);
        $('label[for=True-land],label[for=False-land]').css("opacity", 1);
    });

    //On click of any button check for other filters
    $('input[type="radio"][name=launch-yr-btn],input[type="radio"][name=success-launch-btn],input[type="radio"][name=success-land-btn]').click(function(){
       betterFunction();
      });

    //Clear All button
      $('.spaceX-button').click(function(){
        $('input[name=success-launch-btn]').prop("checked", false); 
        $('input[name=launch-yr-btn]').prop("checked", false); 
        $('input[name=success-land-btn]').prop("checked", false); 
        $('label[for=True-land],label[for=False-land]').css("opacity", 1);
        $('input[type="radio"][name=success-land-btn]').attr('disabled',false);
        window.location.href = sessionStorage.getItem('localUrl');
       // loadCardDetails(true);
      });
}


const delayedSearch = function (fn, delay) {
    let timer;
    return function() {
        let context = this,
            args = arguments;

        clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(context, args);
        }, delay)
    }
}
const betterFunction = delayedSearch(collectFilterData, 1500);